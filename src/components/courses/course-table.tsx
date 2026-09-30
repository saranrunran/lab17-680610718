import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>
                <Badge variant="outline" >{course.program}</Badge>
              </TableCell>
              <TableCell>ภาคการศึกษาที่ {course.semester}</TableCell>
              <TableCell className="max-w-56 min-w-32 whitespace-normal text-muted-foreground">{course.description}</TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {course.instructors.map((instruc, index) => (
                      <div key={instruc.email || index} className="text-sm">
                        <div className="font-medium text-foreground">
                          {instruc.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {instruc.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {course.notifyByEmail === true ? (
                  <Badge variant="default">รับ</Badge>
                ):(
                  <Badge variant="secondary">ไม่รับ</Badge>
                )}
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
