import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  FormGroup,
  Label,
  Input,
  TextArea,
  Button,
  MentorFormGroup,
  MentorLabel,
  MentorSpan,
  Select,
} from "./styles";
import useFindMentor from "./hook";
import { Outlet } from "react-router-dom";
import Toaster from "../ui/Toaster";

const ConsultationForm: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const { mentor, findMentor } = useFindMentor(discipline, studentName);
  const [topic, setTopic] = useState("");
  const [comments, setComments] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchMentor = () => {
    if (discipline && studentName) {
      findMentor();
    }
  };

  useEffect(() => {
    handleSearchMentor();
  }, [discipline, studentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    handleSearchMentor();

    const data = {
      student_name: studentName,
      mentor: mentor || "Не найден",
      topic,
      comments,
      specialization: discipline,
      is_accepted: false,
    };

    console.log("Отправляемые данные:", data);

    try {
      const response = await fetch("http://194.113.106.227:8000/add_consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке");
      }

      setToast({ message: "Вы записаны на консультацию!", type: "success" });
      setStudentName("");
      setTopic("");
      setComments("");
      setDiscipline("Веб");
    } catch (error) {
      setToast({ message: "Ошибка при отправке данных", type: "error" });
    } finally {
      setLoading(false);
    }
  };


  const closeToast = () => {
    setToast(null);
  };

  return (
      <Container>
        <Title>Запись на консультацию</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="discipline">Дисциплина</Label>
            <Select
                id="discipline"
                name="discipline"
                required
                value={discipline}
                onChange={(e) => {
                  setDiscipline(e.target.value);
                }}
            >
              <option value="" disabled>
                Выберите дисциплину
              </option>
              <option value="web">Веб</option>
              <option value="net">ИКТ/Сети</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="student-name">ФИО</Label>
            <Input
                type="text"
                id="student-name"
                name="student_name"
                required
                value={studentName}
                placeholder={"Пример: Шкредов Антон Алеексеевич"}
                onChange={(e) => {
                  setStudentName(e.target.value);
                }}
            />
          </FormGroup>

          <MentorFormGroup>
            <MentorLabel htmlFor="mentor">Ваш наставник:</MentorLabel>
            <MentorSpan id="mentor">{mentor || "Не найден"}</MentorSpan>
          </MentorFormGroup>

          <FormGroup>
            <Label htmlFor="topic">Тема консультации</Label>
            <Input
                type="text"
                id="topic"
                name="topic"
                placeholder={"Пример: Эталонные модели"}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="comments">Дополнительные комментарии или вопросы</Label>
            <TextArea
                id="comments"
                name="comments"
                placeholder="Пример: Вопросы по настройке сетевого оборудования или помощь в проекте по ИКТ"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Отправить"}
          </Button>
        </form>
        {toast && <Toaster message={toast.message} type={toast.type} onClose={closeToast} />}
        <Outlet />
      </Container>
  );
};

export default ConsultationForm;
