package com.smarttask.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // Dynamic DB handling
public class SmartTaskApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(SmartTaskApplication.class, args);
    }

    /**
     * Highly elegant utility to load .env variables directly into Spring System properties at boot time.
     */
    private static void loadDotEnv() {
        try {
            if (Files.exists(Paths.get(".env"))) {
                List<String> lines = Files.readAllLines(Paths.get(".env"));
                for (String line : lines) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String val = parts[1].trim();
                        System.setProperty(key, val);
                    }
                }
                System.out.println("✅ Local .env file parsed successfully into System properties.");
            } else {
                System.out.println("⚠️ No .env file found. Falling back to default system properties.");
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to parse .env file: " + e.getMessage());
        }
    }
}
