package com.hexagon.abuba.global.openfeign.dto.response;

import java.util.List;

public record AnalyseResponseDTO(AnalyseDocumentDTO document, List<AnalyseSentenceDTO> sentences) {
}
