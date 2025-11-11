package main.java.br.edu.ufop.web.sales.converter;

import br.edu.ufop.web.sales.domain.Sale;
import br.edu.ufop.web.sales.entity.SaleEntity;
import org.springframework.stereotype.Component;

@Component
public class SaleConverter {

    public Sale toDomain(SaleEntity entity) {
        if (entity == null) return null;

        Sale domain = new Sale();
        domain.setId(entity.getId());
        domain.setUserId(entity.getUserId());
        domain.setSaleDate(entity.getSaleDate());
        domain.setSaleStatus(entity.getSaleStatus());
        domain.setCreatedAt(entity.getCreatedAt());
        domain.setUpdatedAt(entity.getUpdatedAt());
        
        return domain;
    }

    public SaleEntity toEntity(Sale domain) {
        if (domain == null) return null;

        SaleEntity entity = new SaleEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setSaleDate(domain.getSaleDate());
        entity.setSaleStatus(domain.getSaleStatus());
        
        return entity;
    }
}