package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUsuarioId(String usuarioId);
}
