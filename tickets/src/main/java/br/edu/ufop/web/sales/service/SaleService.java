package br.edu.ufop.web.sales.service;

import br.edu.ufop.web.sales.dto.SaleDTO;
import br.edu.ufop.web.sales.exception.ResourceNotFoundException;
import br.edu.ufop.web.sales.model.Event;
import br.edu.ufop.web.sales.model.Sale;
import br.edu.ufop.web.sales.repository.EventRepository;
import br.edu.ufop.web.sales.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;

    // CREATE
    public Sale createSale(SaleDTO saleDTO) {
        Event event = eventRepository.findById(saleDTO.eventId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + saleDTO.eventId()));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getStartSales()) || now.isAfter(event.getEndSales())) {
            throw new RuntimeException("Vendas para este evento não estão abertas.");
        }
        Sale sale = new Sale();
        sale.setUserId(saleDTO.userId());
        sale.setEvent(event);
        sale.setSaleStatus(saleDTO.saleStatus());
        sale.setSaleDate(now);

        return saleRepository.save(sale);
    }

    // READ (All)
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    // READ (By Id)
    public Sale getSaleById(UUID id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada com id: " + id));
    }
    
    // READ (By User Id)
    public List<Sale> getSalesByUserId(UUID userId) {
        return saleRepository.findByUserId(userId);
    }

    // UPDATE
    public Sale updateSale(UUID id, SaleDTO saleDetails) {
        Sale sale = getSaleById(id);
        
        if (!sale.getEvent().getId().equals(saleDetails.eventId())) {
            Event newEvent = eventRepository.findById(saleDetails.eventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + saleDetails.eventId()));
            sale.setEvent(newEvent);
        }

        sale.setUserId(saleDetails.userId());
        sale.setSaleStatus(saleDetails.saleStatus());

        return saleRepository.save(sale);
    }

    // DELETE
    public void deleteSale(UUID id) {
        Sale sale = getSaleById(id); // Verifica se existe
        saleRepository.delete(sale);
    }
}