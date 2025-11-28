package com.agriverse.file;

import com.agriverse.dto.UploadFileResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private final Path uploadDir;
    private final long maxFileSize;
    private final Set<String> allowedContentTypes = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/jpg");

    public FileStorageService(
            @Value("${app.file-upload.base-dir:uploads}") String uploadDir,
            @Value("${app.file-upload.max-size-mb:5}") long maxSizeMb) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.maxFileSize = maxSizeMb * 1024 * 1024;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            log.info("文件上传目录: {}", uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("无法创建文件上传目录: " + uploadDir, e);
        }
    }

    public UploadFileResponse store(MultipartFile file) {
        validate(file);

        String originalFileName = StringUtils
                .cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image");
        String extension = getFileExtension(originalFileName);
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path datedDir = uploadDir.resolve(datePrefix);

        try {
            Files.createDirectories(datedDir);
        } catch (IOException e) {
            throw new RuntimeException("创建日期目录失败", e);
        }

        String fileName = UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);
        Path targetLocation = datedDir.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("保存文件失败", e);
        }

        String relativePath = datePrefix.replace("\\", "/") + "/" + fileName;

        return UploadFileResponse.builder()
                .url("/uploads/" + relativePath)
                .filename(relativePath)
                .originalName(originalFileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .build();
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("请选择需要上传的文件");
        }
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("图片大小不能超过 " + (maxFileSize / (1024 * 1024)) + "MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType.toLowerCase())) {
            throw new RuntimeException("暂不支持该图片格式，请上传 JPG/PNG/GIF/WebP");
        }
    }

    private String getFileExtension(String filename) {
        if (!StringUtils.hasText(filename) || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
