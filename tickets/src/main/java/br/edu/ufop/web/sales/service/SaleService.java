package br.edu.ufop.web.sales.service;

import br.edu.ufop.web.sales.converter.SaleConverter;
import br.edu.ufop.web.sales.converter.EventConverter;
import br.edu.ufop.web.sales.domain.Sale;
import br.edu.ufop.web.sales.dto.SaleDTO;
import br.edu.ufop.web.sales.exception.ResourceNotFoundException;
import br.edu.ufop.web.sales.entity.EventEntity;
import br.edu.ufop.web.sales.entity.SaleEntity;
import br.edu.ufop.web.sales.repository.EventRepository;
import br.edu.ufop.web.sales.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import main.java.br.edu.ufop.web.sales.converter.EventConverter;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;
    private final SaleConverter saleConverter;
    private final EventConverter eventConverter;

    // CREATE
    public Sale createSale(SaleDTO saleDTO) {
        EventEntity event = eventRepository.findById(saleDTO.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + saleDTO.eventId()));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getStartSales()) || now.isAfter(event.getEndSales())) {
            throw new RuntimeException("Vendas para este evento não estão abertas.");
        }
        SaleEntity sale = new Sale();
        sale.setUserId(saleDTO.userId());
        sale.setEvent(event);
        sale.setSaleStatus(saleDTO.saleStatus());
        sale.setSaleDate(now);

        SaleEntity entityToSave = saleConverter.toEntity(event);
    
        SaleEntity savedEntity = saleRepository.save(entityToSave);

        return saleConverter.toDomain(savedEntity);
    }

    // READ (All)
    public List<Sale> getAllSales() {
        List<SaleEntity> entities = saleRepository.findAll();

        return entities.stream()
                .map(saleConverter::toDomain)
                .collect(Collectors.toList());
    }

    // READ (By Id)
    public Sale getSaleById(UUID id) {
        SaleEntity entity = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com id: " + id));
        
        return saleConverter.toDomain(entity);
    }
    
    // READ (By User Id)
    public List<Sale> getSalesByUserId(UUID userId) {
        SaleEntity entity = saleRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada pelo id: " + userId));

        return saleConverter.toDomain(entity);
    }

    // UPDATE
    public Sale updateSale(UUID id, SaleDTO saleDetails) {
        SaleEntity sale = getSaleById(id);
        
        if (!sale.getEvent().getId().equals(saleDetails.eventId())) {
            EventEntity newEvent = eventRepository.findById(saleDetails.eventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + saleDetails.eventId()));
            sale.setEvent(newEvent);
        }

        sale.setUserId(saleDetails.userId());
        sale.setSaleStatus(saleDetails.saleStatus());

        SaleEntity updatedEntity = saleRepository.save(sale);

        return saleConverter.toDomain(updatedEntity);
    }

    // DELETE
    public void deleteSale(UUID id) {
        SaleEntity sale = getSaleById(id);
        saleRepository.delete(sale);
    }
}