package com.hexagon.abuba.auth.jwt;


import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.io.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {
    private final byte[] cachedBody;

    public CachedBodyHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        InputStreamReader reader = new InputStreamReader(request.getInputStream());
        BufferedReader bufferedReader = new BufferedReader(reader);
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            body.append(line);
        }
        cachedBody = body.toString().getBytes();
    }

    @Override
    public ServletInputStream getInputStream() {
        return new CachedBodyInputStream(cachedBody);
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    private static class CachedBodyInputStream extends ServletInputStream {
        private final ByteArrayInputStream inputStream;

        public CachedBodyInputStream(byte[] cachedBody) {
            this.inputStream = new ByteArrayInputStream(cachedBody);
        }

        @Override
        public boolean isFinished() {
            return inputStream.available() == 0;
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setReadListener(ReadListener readListener) {
            // No-op
        }

        @Override
        public int read() throws IOException {
            return inputStream.read();
        }
    }
}
