import { z } from "zod";

import type { Course } from "@/lib/types";

export const COURSE_TITLE_MAX = 100;
export const DESCRIPTION_MAX = 100;
export const INSTRUCTOR_MAX = 3;

export const CourseFormSchema = z.object({
    courseId: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
    courseTitle: z
        .string()
        .trim()
        .min(1, "กรอกชื่อวิชา")
        .max(COURSE_TITLE_MAX, `ชื่อวิชายาวได้ไม่เกิน ${COURSE_TITLE_MAX} ตัวอักษร`),
    program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }).optional(),
    semester: z.enum(["1", "2", "3"], { message: "เลือกภาคการศึกษา" }).optional(),
    description: z
        .string()
        .trim()
        .max(DESCRIPTION_MAX,`รายละเอียดยาวได้ไม่เกิน ${COURSE_TITLE_MAX} ตัวอักษร`)
        .optional(),
    instructors: z
        .array(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1,"กรอกชื่อผู้สอน"), // ← ตรวจทีละแถว
                email: z
                    .string()
                    .trim()
                    .email("รูปแบบอีเมลไม่ถูกต้อง")
                    .regex(/^.+@cmu\.ac\.th$/i, { message:"ต้องเป็นอีเมล @cmu.ac.th" }), // ← ตรวจทีละแถว
            }),
        )
        .min(1,"ต้องมีผู้สอนอย่างน้อย 1 คน")
        .max(INSTRUCTOR_MAX,"ผู้สอนต้องไม่เกิน 3 คน")
        .refine(
            (items) =>
                new Set(items.map((i) => i.email.toLowerCase())).size ===
                items.length,
            "อีเมลผู้สอนซ้ำกัน",
        ),
    notifyByEmail: z.boolean(),
});

export type CourseFormValues = z.infer<typeof CourseFormSchema>;

/**
 * กันรหัสซ้ำด้วย .refine()
 * ต้องสร้าง "ข้างใน" component (ผ่าน useMemo) เพราะต้องรู้ students ล่าสุดจาก store
 */
export function createCourseFormSchema(existingCourses: Course[]) {
  return CourseFormSchema.refine(
    (data) => !existingCourses.some((s) => s.courseId === data.courseId),
    { message: "รหัสวิชานี้มีอยู่แล้ว", path: ["courseId"] },
  );
}