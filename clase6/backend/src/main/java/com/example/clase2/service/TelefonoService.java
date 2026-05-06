package com.example.clase2.service;

import com.example.clase2.dto.response.TelefonoDto;
import com.example.clase2.dto.resquest.TelefonoRequestDto;
import com.example.clase2.model.Cliente;
import com.example.clase2.model.Telefono;
import com.example.clase2.repository.ClienteRepository;
import com.example.clase2.repository.TelefonoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TelefonoService {

    ClienteRepository clienteRepository;
    TelefonoRepository telefonoRepository;

    TelefonoService(ClienteRepository clienteRepository, TelefonoRepository telefonoRepository) {
        this.clienteRepository = clienteRepository;
        this.telefonoRepository = telefonoRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    public TelefonoDto addTelefono(Long clienteId, TelefonoRequestDto dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + clienteId));

        Telefono telefono = new Telefono();
        telefono.setNumero(dto.getNumero());
        telefono.setDescripcion(dto.getDescripcion());
        telefono.setCliente(cliente);
        cliente.getTelefonos().add(telefono);

        Telefono saved = telefonoRepository.save(telefono);
        return new TelefonoDto(saved.getId(), saved.getNumero(), saved.getDescripcion());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<TelefonoDto> getTelefonosByCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + clienteId));
        return cliente.getTelefonos().stream()
                .map(t -> new TelefonoDto(t.getId(), t.getNumero(), t.getDescripcion()))
                .toList();
    }
}
