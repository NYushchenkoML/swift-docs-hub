package com.swiftdocshub.printer;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "ZebraPrinter")
public class ZebraPrinterPlugin extends Plugin {

    @PluginMethod
    public void print(PluginCall call) {
        String ip = call.getString("ip");
        int port = call.getInt("port", 9100);
        String zpl = call.getString("zpl");
        int timeout = call.getInt("timeout", 5000);

        if (ip == null || zpl == null) {
            call.reject("IP address and ZPL data are required");
            return;
        }

        new Thread(() -> {
            Socket socket = null;
            try {
                socket = new Socket();
                socket.connect(new InetSocketAddress(ip, port), timeout);
                
                OutputStream outputStream = socket.getOutputStream();
                outputStream.write(zpl.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Print job sent successfully");
                call.resolve(result);
            } catch (IOException e) {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("message", "Failed to send ZPL command: " + e.getMessage());
                call.resolve(result);
            } finally {
                if (socket != null && !socket.isClosed()) {
                    try {
                        socket.close();
                    } catch (IOException e) {
                        // Ignore close errors
                    }
                }
            }
        }).start();
    }

    @PluginMethod
    public void calibrate(PluginCall call) {
        String ip = call.getString("ip");
        int port = call.getInt("port", 9100);
        int timeout = call.getInt("timeout", 5000);

        if (ip == null) {
            call.reject("IP address is required");
            return;
        }

        new Thread(() -> {
            Socket socket = null;
            try {
                socket = new Socket();
                socket.connect(new InetSocketAddress(ip, port), timeout);
                
                // Команда калибровки для принтеров Zebra
                String calibrationCommand = "~JC";
                
                OutputStream outputStream = socket.getOutputStream();
                outputStream.write(calibrationCommand.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Calibration command sent successfully");
                call.resolve(result);
            } catch (IOException e) {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("message", "Failed to send calibration command: " + e.getMessage());
                call.resolve(result);
            } finally {
                if (socket != null && !socket.isClosed()) {
                    try {
                        socket.close();
                    } catch (IOException e) {
                        // Ignore close errors
                    }
                }
            }
        }).start();
    }
}
