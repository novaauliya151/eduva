-- CreateTable
CREATE TABLE "student_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grade_level" TEXT NOT NULL DEFAULT 'SMA',
    "placement_level" TEXT,
    "placement_score" DECIMAL(5,2),
    "placement_completed_at" TIMESTAMP(3),

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_questions" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "placement_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_attempts" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "level" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_answers" (
    "id" UUID NOT NULL,
    "attempt_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "selected_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "placement_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE INDEX "placement_attempts_student_id_idx" ON "placement_attempts"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "placement_answers_attempt_id_question_id_key" ON "placement_answers"("attempt_id", "question_id");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_attempts" ADD CONSTRAINT "placement_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "placement_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_answers" ADD CONSTRAINT "placement_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "placement_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
