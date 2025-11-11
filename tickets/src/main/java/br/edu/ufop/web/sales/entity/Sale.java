package br.edu.ufop.web.sales.entity;

import br.edu.ufop.web.sales.entity.base.AuditableEntity;
import br.edu.ufop.web.sales.enums.SaleStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sale extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "saleDate", nullable = false)
    private LocalDateTime saleDate;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "saleStatus", nullable = false)
    private SaleStatus saleStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;
}