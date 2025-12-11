export interface GradingResult {
  score: number; // 0-100
  feedback: string;
  level: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * 영작 답안을 채점하는 함수
 * @param userAnswer 사용자가 작성한 답안
 * @param modelAnswer 모범 답안
 * @returns 채점 결과
 */
export function gradeWriting(userAnswer: string, modelAnswer: string): GradingResult {
  const user = userAnswer.trim().toLowerCase();
  const model = modelAnswer.trim().toLowerCase();

  if (!user) {
    return {
      score: 0,
      feedback: '답안을 입력해주세요.',
      level: 'poor'
    };
  }

  // 완전 일치
  if (user === model) {
    return {
      score: 100,
      feedback: '완벽합니다! 모범 답안과 동일합니다.',
      level: 'excellent'
    };
  }

  // 유사도 계산
  const similarity = calculateSimilarity(user, model);
  const keywordMatch = calculateKeywordMatch(user, model);
  const lengthScore = calculateLengthScore(user, model);

  // 종합 점수 (가중 평균)
  const finalScore = Math.round(
    similarity * 0.5 + 
    keywordMatch * 0.3 + 
    lengthScore * 0.2
  );

  return {
    score: finalScore,
    feedback: generateFeedback(finalScore, user, model),
    level: getScoreLevel(finalScore)
  };
}

/**
 * Levenshtein Distance를 이용한 유사도 계산
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 100;

  const editDistance = levenshteinDistance(longer, shorter);
  const similarity = ((longer.length - editDistance) / longer.length) * 100;
  
  return Math.max(0, similarity);
}

/**
 * Levenshtein Distance 알고리즘
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * 핵심 단어 일치율 계산
 */
function calculateKeywordMatch(userAnswer: string, modelAnswer: string): number {
  // 불용어 제거
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);
  
  const userWords = userAnswer.split(/\s+/).filter(w => !stopWords.has(w) && w.length > 2);
  const modelWords = modelAnswer.split(/\s+/).filter(w => !stopWords.has(w) && w.length > 2);

  if (modelWords.length === 0) return 100;

  let matchCount = 0;
  modelWords.forEach(word => {
    if (userWords.some(uw => uw.includes(word) || word.includes(uw))) {
      matchCount++;
    }
  });

  return (matchCount / modelWords.length) * 100;
}

/**
 * 길이 점수 계산
 */
function calculateLengthScore(userAnswer: string, modelAnswer: string): number {
  const userLength = userAnswer.split(/\s+/).length;
  const modelLength = modelAnswer.split(/\s+/).length;

  if (modelLength === 0) return 100;

  const ratio = userLength / modelLength;
  
  // 너무 짧거나 길면 감점
  if (ratio < 0.5 || ratio > 2) return 50;
  if (ratio < 0.7 || ratio > 1.5) return 70;
  if (ratio < 0.9 || ratio > 1.2) return 85;
  
  return 100;
}

/**
 * 점수에 따른 피드백 생성
 */
function generateFeedback(score: number, userAnswer: string, modelAnswer: string): string {
  if (score >= 90) {
    return '훌륭합니다! 거의 완벽한 답안입니다.';
  } else if (score >= 75) {
    return '좋습니다! 몇 가지만 수정하면 완벽합니다.';
  } else if (score >= 60) {
    return '괜찮습니다. 핵심 내용은 포함되어 있으나 개선의 여지가 있습니다.';
  } else if (score >= 40) {
    return '아쉽습니다. 모범 답안과 차이가 많이 납니다. 다시 시도해보세요.';
  } else {
    return '더 노력이 필요합니다. 모범 답안을 참고하여 다시 작성해보세요.';
  }
}

/**
 * 점수 레벨 결정
 */
function getScoreLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
