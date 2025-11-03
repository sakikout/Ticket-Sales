package br.edu.ufop.web.sales.repository;

import br.edu.ufop.web.sales.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {
    List<Sale> findByUserId(UUID userId);
    List<Sale> findByEventId(UUID eventId);
}