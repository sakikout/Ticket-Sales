package br.edu.ufop.web.sales.service;

import br.edu.ufop.web.sales.dto.EventDTO;
import br.edu.ufop.web.sales.exception.ResourceNotFoundException;
import br.edu.ufop.web.sales.model.Event;
import br.edu.ufop.web.sales.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    // CREATE
    public Event createEvent(EventDTO eventDTO) {
        Event event = new Event();
        // Mapeamento manual de DTO para Entidade
        event.setDescription(eventDTO.description());
        event.setType(eventDTO.type());
        event.setDate(eventDTO.date());
        event.setStartSales(eventDTO.startSales());
        event.setEndSales(eventDTO.endSales());
        event.setPrice(eventDTO.price());

        return eventRepository.save(event);
    }

    // READ (All)
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // READ (By Id)
    public Event getEventById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));
    }

    // UPDATE
    public Event updateEvent(UUID id, EventDTO eventDetails) {
        Event event = getEventById(id);

        event.setDescription(eventDetails.description());
        event.setType(eventDetails.type());
        event.setDate(eventDetails.date());
        event.setStartSales(eventDetails.startSales());
        event.setEndSales(eventDetails.endSales());
        event.setPrice(eventDetails.price());

        return eventRepository.save(event);
    }

    // DELETE
    public void deleteEvent(UUID id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}