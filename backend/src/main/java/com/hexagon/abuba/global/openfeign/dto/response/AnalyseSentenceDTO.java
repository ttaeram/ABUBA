package com.hexagon.abuba.global.openfeign.dto.response;

import java.util.List;

public record AnalyseSentenceDTO(String content,
                                 Integer offset,
                                 Integer length,
                                 String sentiment,
                                 AnalyseConfidenceDTO confidence,
                                 List<AnalyseHighlightsDTO> highlights) {
}
