package com.weka.prediction;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import weka.classifiers.trees.RandomForest;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

import java.io.*;
import java.lang.reflect.Field;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.Executors;

public class WekaPredictionServer {

    private static RandomForest classifier;
    private static Instances header;
    private static int port = 8081;
    private static String modelPath = "backend/model/projectmodel_weka.model";

    public static void main(String[] args) {
        if (args.length > 0) {
            modelPath = args[0];
        }
        if (args.length > 1) {
            try {
                port = Integer.parseInt(args[1]);
            } catch (NumberFormatException ignored) {}
        }

        System.out.println("[Java Weka Server] Starting Weka Prediction Engine...");
        System.out.println("[Java Weka Server] Model file: " + modelPath);
        System.out.println("[Java Weka Server] Port: " + port);

        try {
            loadModel(modelPath);
            System.out.println("[Java Weka Server] Model loaded successfully.");
            System.out.println("[Java Weka Server] Relation name: " + header.relationName());
            System.out.println("[Java Weka Server] Attributes count: " + header.numAttributes());
            System.out.println("[Java Weka Server] Class index: " + header.classIndex() + " (" + header.classAttribute().name() + ")");

            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
            server.createContext("/health", new HealthHandler());
            server.createContext("/predict", new PredictHandler());
            server.createContext("/info", new InfoHandler());
            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("[Java Weka Server] Server is running on http://127.0.0.1:" + port);
        } catch (Exception e) {
            System.err.println("[Java Weka Server] FATAL ERROR during initialization: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void loadModel(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new FileNotFoundException("Model file does not exist at: " + file.getAbsolutePath());
        }

        Object obj = SerializationHelper.read(path);
        if (!(obj instanceof RandomForest)) {
            throw illegalState("Loaded model object is not a RandomForest classifier! Found: " + (obj != null ? obj.getClass().getName() : "null"));
        }

        classifier = (RandomForest) obj;

        // Extract header from RandomForest m_data
        Field f = null;
        Class<?> curr = classifier.getClass();
        while (curr != null) {
            try {
                f = curr.getDeclaredField("m_data");
                break;
            } catch (NoSuchFieldException e) {
                curr = curr.getSuperclass();
            }
        }

        if (f == null) {
            throw new IllegalStateException("Field 'm_data' not found on RandomForest hierarchy.");
        }

        f.setAccessible(true);
        header = (Instances) f.get(classifier);
        if (header == null) {
            throw new IllegalStateException("Header 'm_data' in RandomForest is null.");
        }
    }

    private static IllegalStateException illegalState(String msg) {
        return new IllegalStateException(msg);
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
                return;
            }

            boolean isHealthy = classifier != null && header != null;
            String response = String.format(
                    "{\"status\": \"%s\", \"model_loaded\": %b, \"relation\": \"%s\", \"attributes\": %d}",
                    isHealthy ? "healthy" : "unhealthy",
                    isHealthy,
                    header != null ? header.relationName() : "unknown",
                    header != null ? header.numAttributes() : 0
            );

            sendResponse(exchange, isHealthy ? 200 : 503, response);
        }
    }

    static class InfoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
                return;
            }

            if (header == null) {
                sendResponse(exchange, 503, "{\"error\": \"Model not loaded\"}");
                return;
            }

            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"classifier\":\"RandomForest\",");
            sb.append("\"relation\":\"").append(escapeJson(header.relationName())).append("\",");
            sb.append("\"num_attributes\":").append(header.numAttributes()).append(",");
            sb.append("\"class_attribute\":\"").append(escapeJson(header.classAttribute().name())).append("\",");
            sb.append("\"class_values\":[");
            for (int i = 0; i < header.classAttribute().numValues(); i++) {
                if (i > 0) sb.append(",");
                sb.append("\"").append(escapeJson(header.classAttribute().value(i))).append("\"");
            }
            sb.append("],");
            sb.append("\"attributes\":[");
            for (int i = 0; i < header.numAttributes(); i++) {
                Attribute a = header.attribute(i);
                if (i > 0) sb.append(",");
                sb.append("{");
                sb.append("\"index\":").append(i).append(",");
                sb.append("\"name\":\"").append(escapeJson(a.name())).append("\",");
                sb.append("\"type\":\"").append(Attribute.typeToString(a)).append("\"");
                if (a.isNominal()) {
                    sb.append(",\"nominal_values\":[");
                    for (int v = 0; v < a.numValues(); v++) {
                        if (v > 0) sb.append(",");
                        sb.append("\"").append(escapeJson(a.value(v))).append("\"");
                    }
                    sb.append("]");
                }
                sb.append("}");
            }
            sb.append("]");
            sb.append("}");

            sendResponse(exchange, 200, sb.toString());
        }
    }

    static class PredictHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
                return;
            }

            if (classifier == null || header == null) {
                sendResponse(exchange, 503, "{\"error\": \"Prediction engine not initialized\"}");
                return;
            }

            String body;
            try (InputStream is = exchange.getRequestBody();
                 ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                byte[] buf = new byte[4096];
                int read;
                while ((read = is.read(buf)) != -1) {
                    os.write(buf, 0, read);
                }
                body = os.toString(StandardCharsets.UTF_8.name());
            }

            if (body == null || body.trim().isEmpty()) {
                sendResponse(exchange, 400, "{\"error\": \"Empty request body\"}");
                return;
            }

            try {
                Map<String, Object> inputMap = parseSimpleJson(body);

                Instance instance = new DenseInstance(header.numAttributes());
                instance.setDataset(header);

                for (int i = 0; i < header.numAttributes(); i++) {
                    if (i == header.classIndex()) {
                        instance.setMissing(i);
                        continue;
                    }

                    Attribute attr = header.attribute(i);
                    String attrName = attr.name();

                    // Search for key matching attribute name (case-insensitive or key normalization)
                    Object val = findValue(inputMap, attrName);

                    if (val == null) {
                        // Attribute missing
                        throw new IllegalArgumentException("Missing required attribute: '" + attrName + "'");
                    }

                    if (attr.isNominal()) {
                        String sVal = val.toString().trim();
                        int nomIdx = attr.indexOfValue(sVal);
                        if (nomIdx < 0) {
                            // Try case-insensitive lookup
                            for (int v = 0; v < attr.numValues(); v++) {
                                if (attr.value(v).equalsIgnoreCase(sVal)) {
                                    nomIdx = v;
                                    break;
                                }
                            }
                        }
                        if (nomIdx < 0) {
                            throw new IllegalArgumentException("Invalid nominal value '" + sVal + "' for attribute '" + attrName + "'. Expected one of: " + getNominalValues(attr));
                        }
                        instance.setValue(i, nomIdx);
                    } else if (attr.isNumeric()) {
                        double dVal;
                        try {
                            dVal = Double.parseDouble(val.toString().trim());
                        } catch (NumberFormatException e) {
                            throw new IllegalArgumentException("Invalid numeric value '" + val + "' for attribute '" + attrName + "'");
                        }
                        instance.setValue(i, dVal);
                    }
                }

                double classIdx = classifier.classifyInstance(instance);
                double[] distribution = classifier.distributionForInstance(instance);

                String predictedClass = header.classAttribute().value((int) classIdx);

                StringBuilder jsonResp = new StringBuilder();
                jsonResp.append("{");
                jsonResp.append("\"status\":\"success\",");
                jsonResp.append("\"predicted_class\":\"").append(escapeJson(predictedClass)).append("\",");
                jsonResp.append("\"class_index\":").append((int) classIdx).append(",");
                jsonResp.append("\"probabilities\":{");
                for (int c = 0; c < header.classAttribute().numValues(); c++) {
                    if (c > 0) jsonResp.append(",");
                    String className = header.classAttribute().value(c);
                    double prob = (c < distribution.length) ? distribution[c] : 0.0;
                    jsonResp.append("\"").append(escapeJson(className)).append("\":").append(String.format(Locale.US, "%.4f", prob));
                }
                jsonResp.append("}}");

                sendResponse(exchange, 200, jsonResp.toString());

            } catch (IllegalArgumentException e) {
                sendResponse(exchange, 400, "{\"error\": \"" + escapeJson(e.getMessage()) + "\"}");
            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, 500, "{\"error\": \"Prediction computation failed: " + escapeJson(e.getMessage()) + "\"}");
            }
        }

        private Object findValue(Map<String, Object> map, String attrName) {
            if (map.containsKey(attrName)) return map.get(attrName);
            // Check snake_case or stripped
            String strippedTarget = normalizeKey(attrName);
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (normalizeKey(entry.getKey()).equals(strippedTarget)) {
                    return entry.getValue();
                }
            }
            return null;
        }

        private String normalizeKey(String key) {
            return key.toLowerCase().replaceAll("[^a-z0-9]", "");
        }

        private String getNominalValues(Attribute attr) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < attr.numValues(); i++) {
                if (i > 0) sb.append(", ");
                sb.append(attr.value(i));
            }
            sb.append("]");
            return sb.toString();
        }
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    /**
     * Minimal recursive JSON parser for standard flat or key-value prediction payloads.
     */
    public static Map<String, Object> parseSimpleJson(String json) {
        Map<String, Object> map = new LinkedHashMap<>();
        String trimmed = json.trim();
        if (trimmed.startsWith("{")) trimmed = trimmed.substring(1);
        if (trimmed.endsWith("}")) trimmed = trimmed.substring(0, trimmed.length() - 1);

        int len = trimmed.length();
        int i = 0;
        while (i < len) {
            while (i < len && (Character.isWhitespace(trimmed.charAt(i)) || trimmed.charAt(i) == ',')) i++;
            if (i >= len) break;

            // Read Key
            if (trimmed.charAt(i) != '"') {
                i++;
                continue;
            }
            i++; // skip opening quote
            StringBuilder keySb = new StringBuilder();
            while (i < len && trimmed.charAt(i) != '"') {
                if (trimmed.charAt(i) == '\\' && i + 1 < len) i++;
                keySb.append(trimmed.charAt(i));
                i++;
            }
            if (i < len) i++; // skip closing quote

            // Skip until colon
            while (i < len && trimmed.charAt(i) != ':') i++;
            if (i < len) i++; // skip colon

            // Read Value
            while (i < len && Character.isWhitespace(trimmed.charAt(i))) i++;
            if (i >= len) break;

            if (trimmed.charAt(i) == '"') {
                i++;
                StringBuilder valSb = new StringBuilder();
                while (i < len && trimmed.charAt(i) != '"') {
                    if (trimmed.charAt(i) == '\\' && i + 1 < len) i++;
                    valSb.append(trimmed.charAt(i));
                    i++;
                }
                if (i < len) i++;
                map.put(keySb.toString(), valSb.toString());
            } else {
                StringBuilder valSb = new StringBuilder();
                while (i < len && trimmed.charAt(i) != ',' && trimmed.charAt(i) != '}') {
                    valSb.append(trimmed.charAt(i));
                    i++;
                }
                String valStr = valSb.toString().trim();
                if ("true".equalsIgnoreCase(valStr)) {
                    map.put(keySb.toString(), Boolean.TRUE);
                } else if ("false".equalsIgnoreCase(valStr)) {
                    map.put(keySb.toString(), Boolean.FALSE);
                } else if ("null".equalsIgnoreCase(valStr)) {
                    map.put(keySb.toString(), null);
                } else {
                    try {
                        if (valStr.contains(".")) {
                            map.put(keySb.toString(), Double.parseDouble(valStr));
                        } else {
                            map.put(keySb.toString(), Long.parseLong(valStr));
                        }
                    } catch (NumberFormatException e) {
                        map.put(keySb.toString(), valStr);
                    }
                }
            }
        }
        return map;
    }
}
