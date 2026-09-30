import { useState, useMemo } from "react";
import { PlusCircle, X, Plus, RotateCcw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCourseFormSchema,
  DESCRIPTION_MAX,
  INSTRUCTOR_MAX,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import {
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEnrollmentStore } from "@/lib/enrollment-store";
/**
 *   (Lab 17): เขียนฟอร์มนี้ใหม่ด้วย Zod + React Hook Form
 *   (ดูตัวอย่างใน components/students/add-new-student-dialog.tsx)
 *   - schema ใหม่ที่ src/lib/schemas/course-schema.ts (แทน course-validation.ts)
 *   - ผู้สอนเป็น Array Fields (useFieldArray) — ชื่อ + อีเมล @cmu.ac.th, 1–3 คน
 *   - หลักสูตร (Select), ภาคการศึกษา (Radio Group), รายละเอียด (Textarea 0/100),
 *     รับข่าวสารทางอีเมล (Switch)
 */
const programOptions = [
  { value: "CPE", label: "CPE — วิศวกรรมคอมพิวเตอร์" },
  { value: "ISNE", label: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย" },
];

export const emptyCourseForm: CourseFormValues = {
  courseId: "",
  courseTitle: "",
  program: undefined,
  semester: undefined,
  instructors: [{name: "",email: "",}],
  notifyByEmail: false,
  description: ""
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => createCourseFormSchema(courses), [courses]);

  // state ที่ต้องถือเองสามก้อน (Zod + React Hook Form จะรวมเป็น useForm ตัวเดียว)
  // {const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
  // const [errors, setErrors] = useState<CourseFormErrors>({});
  // const [touched, setTouched] = useState<
  //   Partial<Record<keyof CourseFormValues, boolean>>
  // >({});

  // const [instructorInput, setInstructorInput] = useState("");
  // const instructorsAnchor = useComboboxAnchor();

  // const knownInstructors = [...new Set(courses.flatMap((c) => c.instructors))];
  // const typedInstructor = instructorInput.trim();
  // const isNewInstructor =
  //   typedInstructor.length > 0 &&
  //   !knownInstructors.some(
  //     (name) => name.toLowerCase() === typedInstructor.toLowerCase(),
  //   ) &&
  //   !values.instructors.includes(typedInstructor);
  // const instructorItems = [
  //   ...knownInstructors,
  //   ...values.instructors.filter((name) => !knownInstructors.includes(name)),
  //   ...(isNewInstructor ? [typedInstructor] : []),
  // ];

  // const checkField = (name: keyof CourseFormValues, next: CourseFormValues) => {
  //   setErrors((prev) => ({
  //     ...prev,
  //     [name]: validateCourseField(name, next, courses),
  //   }));
  // };

  // const handleChange = <K extends keyof CourseFormValues>(
  //   name: K,
  //   value: CourseFormValues[K],
  // ) => {
  //   const next = { ...values, [name]: value };
  //   setValues(next);
  //   // ช่องที่เคยออกไปแล้ว (touched) เช็กใหม่ทันทีตอนแก้ — error หายเมื่อแก้ถูก
  //   if (touched[name]) checkField(name, next);
  // };

  // // เทียบได้กับ mode: "onBlur" ของ React Hook Form
  // const handleBlur = (name: keyof CourseFormValues) => {
  //   setTouched((prev) => ({ ...prev, [name]: true }));
  //   checkField(name, values);
  // };

  // const resetForm = () => {
  //   setValues(emptyCourseForm);
  //   setErrors({});
  //   setTouched({});
  //   setInstructorInput("");
  // };

  // // ด่านตรวจก่อนเข้า store — เทียบได้กับ form.handleSubmit(onSubmit)
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const nextErrors = validateCourseForm(values, courses);
  //   setErrors(nextErrors);
  //   setTouched({ courseId: true, courseTitle: true, instructors: true });
  //   if (Object.keys(nextErrors).length > 0) return; // ไม่ผ่าน → ไม่เรียก addCourse

  //   addCourse({
  //     courseId: values.courseId.trim(),
  //     courseTitle: values.courseTitle.trim(),
  //     instructors: values.instructors,
  //   });
  //   resetForm();
  //   setOpen(false);
  // };

  // // ต้องต่อ id / aria-* / ข้อความ error เองทุกช่อง (<FormItem/FormControl/FormMessage> จะทำแทน)
  // const errorOf = (name: keyof CourseFormValues) =>
  //   touched[name] ? errors[name] : undefined;

  // const invalidProps = (name: keyof CourseFormValues) => ({
  //   "aria-invalid": errorOf(name) ? true : undefined,
  //   "aria-describedby": errorOf(name) ? `${name}-error` : undefined,
  // });

  // const fieldError = (name: keyof CourseFormValues) => {
  //   const message = errorOf(name);
  //   return message ? (
  //     <p id={`${name}-error`} className="text-sm text-destructive">
  //       {message}
  //     </p>
  //   ) : null;
  // };}

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyCourseForm,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  });

  const emailsError =
    form.formState.errors.instructors?.root ?? form.formState.errors.instructors;

  const resetForm = () => form.reset(emptyCourseForm);

  function onSubmit(values: CourseFormValues) {
    addCourse(values);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว ใส่อีเมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100 ตัวอักษร แล้วกดบันทึก
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="courseId"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="courseId">รหัสวิชา</FieldLabel>
                    <Input
                      {...field}
                      id="courseId"
                      placeholder="เช่น 261305"
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="courseTitle"
                control={form.control}
                render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="courseTitle">ชื่อวิชา</FieldLabel>
                    <Input
                      {...field}
                      id="courseTitle"
                      placeholder="เช่น Mobile Application Development"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="program"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="program">หลักสูตร</FieldLabel>
                  <Select
                    name={field.name}
                    items={programOptions}
                    value={field.value ?? null}
                    onValueChange={(v) => {
                      field.onChange(v);
                      field.onBlur(); 
                    }}
                  >
                    <SelectTrigger
                      id="program"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="เลือกหลักสูตร" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="semester"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="semester">ภาคการศึกษา</FieldLabel>
                  <RadioGroup
                    value={field.value ?? ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    onBlur={field.onBlur}
                    className="flex flex-row"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="1" id="semester-1" />
                      <Label htmlFor="1">ภาคการศึกษาที่ 1</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="2" id="semester-2" />
                      <Label htmlFor="2">ภาคการศึกษาที่ 2</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="3" id="semester-3" />
                      <Label htmlFor="3">ภาคฤดูร้อน</Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({field, fieldState}) => {
                const currentLength = (field.value ?? "").length;
                const isOverLimit = currentLength > DESCRIPTION_MAX;
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">รายละเอียด(ไม่บังคับ)</FieldLabel>
                    <Textarea
                      {...field}
                      id="description" 
                      placeholder="คำอธิบายรายวิชาสั้น ๆ"
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                    />
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span
                        className={
                          isOverLimit
                          ? "text-red-500 font-medium"
                          : "text-muted-foreground"
                        }
                        >
                        {currentLength}/{DESCRIPTION_MAX} ตัวอักษร
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <span />
                        )}
                      </span>
                    </div>
                  </Field>
                )}
              }
            />

            <FieldSet data-invalid={!!emailsError?.message}>
              <FieldLegend variant="label">ผู้สอน</FieldLegend>
              <FieldDescription>
                {fields.length}/{INSTRUCTOR_MAX}  คน — กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
              </FieldDescription>

              <FieldGroup className="gap-3">
                {fields.map((item,index) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className="mt-1.5 w-5 shrink-0 text-sm text-muted-foreground">
                      {index + 1}.
                    </span>
                    <Controller
                      name={`instructors.${index}.name`}
                      control={form.control}
                      render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid} className="flex-1">
                          <FieldContent>
                            <Input
                              {...field}
                              id={`instructor-name-${index}`}
                              placeholder="ชื่อผู้สอน"
                              aria-label={`ชื่อผู้สอนที่ ${index + 1}`}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                    <Controller
                      name={`instructors.${index}.email`}
                      control={form.control}
                      render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid} className="flex-1">
                          <FieldContent>
                            <Input
                              {...field}
                              id={`instructor-email-${index}`}
                              placeholder="name@cmu.ac.th"
                              aria-label={`อีเมลผู้สอนที่ ${index + 1}`}
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`ลบอีเมลที่ ${index + 1}`}
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </FieldGroup>

              {/* ─── Array Validation: error ระดับ array ─── */}
              {emailsError?.message && <FieldError errors={[emailsError]} />}
              
              {/* ─── append({...}) ─── */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={fields.length >= INSTRUCTOR_MAX}
                onClick={() => append({ name: "", email: "" })}
              >
                <Plus className="size-4" />
                เพิ่มผู้สอน
              </Button>
            </FieldSet>
            <Controller
              name="notifyByEmail"
              control={form.control}
              render={({field, fieldState}) => (
                <Field 
                  data-invalid={fieldState.invalid} 
                  orientation="horizontal"
                  className="rounded-lg border p-4"
                >
                  <FieldContent>
                    <FieldLabel htmlFor="notifyByEmail">
                      รับข่าวสารทางอีเมล
                    </FieldLabel>
                    <FieldDescription>
                      แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                    </FieldDescription>
                  </FieldContent>
                  <Switch 
                    id="notifyByEmail"
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            {/* ล้างฟอร์ม — กลับเป็นค่าเริ่มต้น + ล้าง error โดยไม่ปิด popup */}
            <Button type="button" variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4" />
              ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

