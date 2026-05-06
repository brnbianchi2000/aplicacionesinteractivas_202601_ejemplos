package com.example.clase2.dto.response;

public class TelefonoDto {
    private Long id;
    private String numero;
    private String descripcion;

    public TelefonoDto(Long id, String numero, String descripcion) {
        this.id = id;
        this.numero = numero;
        this.descripcion = descripcion;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
