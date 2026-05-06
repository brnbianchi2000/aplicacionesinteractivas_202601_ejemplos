package com.example.clase2.dto.resquest;

public class TelefonoRequestDto {
    private String numero;
    private String descripcion;

    public TelefonoRequestDto() {}

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
