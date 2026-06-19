package com.example.demo.repository;

import com.example.demo.model.Click;
import com.example.demo.model.Url;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickRepository extends JpaRepository<Click, Long> {
    List<Click> findByUrl(Url url);
    long countByUrl(Url url);
}
