
export interface SkillAssessmentId {
  skillId?: number;
  userId?: number;
}

export interface SkillAssessment {
    id?: SkillAssessmentId;
    interest?: number;
    proficiency?: number;
}
