package com.example.clase2.service;

import com.example.clase2.dto.resquest.ClienteRequestDto;
import com.example.clase2.model.Cliente;
import com.example.clase2.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {
    ClienteRepository clienteRepository;
    ClienteService(ClienteRepository clienteRepository){
        this.clienteRepository = clienteRepository;
    }
    public List<Cliente> getClientes(){
        return clienteRepository.findAll();
    }
    public Cliente addCliente(ClienteRequestDto clienteRequestDto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(clienteRequestDto.getNombre());
        return clienteRepository.save(cliente);
    }

}
