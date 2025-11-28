package com.agriverse.file;

import com.agriverse.dto.ApiResponse;
import com.agriverse.dto.UploadFileResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Slf4j
@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UploadFileResponse>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            UploadFileResponse stored = fileStorageService.store(file);

            String absoluteUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(stored.getUrl())
                    .toUriString();

            stored.setUrl(absoluteUrl);

            return ResponseEntity.ok(ApiResponse.success("上传成功", stored));
        } catch (RuntimeException ex) {
            log.warn("文件上传失败: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, ex.getMessage()));
        } catch (Exception ex) {
            log.error("文件上传异常", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "文件上传失败，请稍后重试"));
        }
    }
}
