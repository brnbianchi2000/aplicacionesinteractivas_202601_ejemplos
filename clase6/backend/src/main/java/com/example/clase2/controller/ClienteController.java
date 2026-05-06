package com.example.clase2.controller;

import com.example.clase2.dto.resquest.ClienteRequestDto;
import com.example.clase2.model.Cliente;
import com.example.clase2.service.ClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    ClienteService clienteService;
    ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> getClientes() {
        return clienteService.getClientes();
    }

    @PostMapping
    public String addCliente(@RequestBody ClienteRequestDto clienteRequestDto) {
        Cliente cliente = clienteService.addCliente(clienteRequestDto);
        return "Cliente agregado: " + cliente.toString();
    }

    /*
    @DeleteMapping("/{id}")
    public String deleteCliente(@PathVariable Long id) {
        boolean removed = clientes.removeIf(c -> c.getId().equals(id));
        if (removed) {
            return "Cliente eliminado con id: " + id;
        }
        return "Cliente no encontrado con id: " + id;
    }
    */
}
