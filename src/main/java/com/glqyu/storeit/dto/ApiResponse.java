package com.glqyu.storeit.dto;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse() {}
    public ApiResponse(boolean success, String message) {
        this.success = success; this.message = message;
    }
    public ApiResponse(boolean success, String message, T data) {
        this.success = success; this.message = message; this.data = data;
    }
    public static <T> ApiResponse<T> ok(String message, T data) { return new ApiResponse<>(true, message, data); }
    public static <T> ApiResponse<T> ok(String message) { return new ApiResponse<>(true, message, null); }
    public static <T> ApiResponse<T> fail(String message) { return new ApiResponse<>(false, message, null); }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
