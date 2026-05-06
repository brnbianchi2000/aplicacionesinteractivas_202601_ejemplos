package com.example.clase2.controller;

import com.example.clase2.dto.response.TelefonoDto;
import com.example.clase2.dto.resquest.TelefonoRequestDto;
import com.example.clase2.service.TelefonoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes/{clienteId}/telefonos")
public class TelefonoController {

    TelefonoService telefonoService;

    TelefonoController(TelefonoService telefonoService) {
        this.telefonoService = telefonoService;
    }

    @GetMapping
    public List<TelefonoDto> getTelefonos(@PathVariable Long clienteId) {
        return telefonoService.getTelefonosByCliente(clienteId);
    }

    @PostMapping
    public TelefonoDto addTelefono(@PathVariable Long clienteId,
                                   @RequestBody TelefonoRequestDto dto) {
        return telefonoService.addTelefono(clienteId, dto);
    }
}
