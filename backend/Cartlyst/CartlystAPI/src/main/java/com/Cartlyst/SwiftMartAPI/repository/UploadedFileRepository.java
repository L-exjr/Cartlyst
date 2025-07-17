package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
}
