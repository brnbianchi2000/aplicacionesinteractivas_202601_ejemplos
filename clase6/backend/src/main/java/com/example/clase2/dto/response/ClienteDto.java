package com.example.clase2.dto.response;

import java.util.List;

public class ClienteDto {
    private Long id;
    private String nombre;
    private List<TelefonoDto> telefonos;

    public ClienteDto(Long id, String nombre, List<TelefonoDto> telefonos) {
        this.id = id;
        this.nombre = nombre;
        this.telefonos = telefonos;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public List<TelefonoDto> getTelefonos() { return telefonos; }
    public void setTelefonos(List<TelefonoDto> telefonos) { this.telefonos = telefonos; }
}
