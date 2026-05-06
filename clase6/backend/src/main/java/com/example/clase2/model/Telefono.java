package com.example.clase2.model;

import jakarta.persistence.*;

@Entity
public class Telefono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Cliente cliente;

    public Telefono() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    @Override
    public String toString() {
        return "Telefono{id=" + id + ", numero='" + numero + "', descripcion='" + descripcion + "'}";
    }
}
