package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.AnswerRequest;
import com.agriverse.expert.dto.QuestionSearchRequest;
import com.agriverse.expert.entity.ExpertAnswer;
import com.agriverse.expert.entity.ExpertQuestion;
import com.agriverse.expert.service.ExpertQAService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/expert/qa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家问答管理", description = "问题回答和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertQAController {
    private final ExpertQAService qaService;
    
    /**
     * 搜索问题
     */
    @Operation(summary = "搜索问题", description = "根据关键词、状态等条件搜索问题")
    @PostMapping("/questions/search")
    public ResponseEntity<ApiResponse<Page<ExpertQuestion>>> searchQuestions(
            @Valid @RequestBody QuestionSearchRequest request) {
        try {
            Page<ExpertQuestion> questions = qaService.searchQuestions(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", questions));
        } catch (Exception e) {
            log.error("搜索问题异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待回答问题列表
     */
    @Operation(summary = "获取待回答问题列表", description = "获取所有待回答的问题")
    @GetMapping("/questions/pending")
    public ResponseEntity<ApiResponse<Page<ExpertQuestion>>> getPendingQuestions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            QuestionSearchRequest request = new QuestionSearchRequest();
            request.setStatus("PENDING");
            request.setPage(page);
            request.setSize(size);
            Page<ExpertQuestion> questions = qaService.searchQuestions(request);
            return ResponseEntity.ok(ApiResponse.success("获取成功", questions));
        } catch (Exception e) {
            log.error("获取待回答问题列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取问题详情
     */
    @Operation(summary = "获取问题详情", description = "获取问题的详细信息")
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<ApiResponse<ExpertQuestion>> getQuestionDetail(
            @PathVariable String questionId) {
        try {
            ExpertQuestion question = qaService.getQuestionDetail(questionId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", question));
        } catch (Exception e) {
            log.error("获取问题详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 回答问题
     */
    @Operation(summary = "回答问题", description = "专家回答问题")
    @PostMapping("/answers")
    public ResponseEntity<ApiResponse<ExpertAnswer>> answerQuestion(
            @Valid @RequestBody AnswerRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAnswer answer = qaService.answerQuestion(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("回答成功", answer));
        } catch (Exception e) {
            log.error("回答问题异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "回答失败，请稍后重试"));
        }
    }
    
    /**
     * 获取我的回答列表
     */
    @Operation(summary = "获取我的回答列表", description = "获取专家回答的所有问题")
    @GetMapping("/my-answers")
    public ResponseEntity<ApiResponse<Page<ExpertAnswer>>> getMyAnswers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertAnswer> answers = qaService.getMyAnswers(expertId, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", answers));
        } catch (Exception e) {
            log.error("获取我的回答列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}

