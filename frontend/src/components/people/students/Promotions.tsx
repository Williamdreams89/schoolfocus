import { useState } from 'react';
import {
  ActionIcon,
  Checkbox,
  Combobox,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { Box, Card, Typography, Button as MainButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import "./TransferList.module.css";
import { Select, Button, Group, Title } from "@mantine/core";

interface Student {
  id: number;
  name: string;
  avatar: string;
}

const studentsGroup1: Student[] = [
  { id: 1, name: 'John Doe', avatar: '/avatars/john_doe.jpg' },
  { id: 2, name: 'Jane Smith', avatar: '/avatars/jane_smith.jpg' },
  { id: 3, name: 'Alice Brown', avatar: '/avatars/alice_brown.jpg' },
  { id: 4, name: 'Bob Johnson', avatar: '/avatars/bob_johnson.jpg' },
  { id: 5, name: 'Charlie Davis', avatar: '/avatars/charlie_davis.jpg' },
  { id: 6, name: 'Emily Clark', avatar: '/avatars/emily_clark.jpg' },
  { id: 7, name: 'Frank Miller', avatar: '/avatars/frank_miller.jpg' },
  { id: 8, name: 'Grace Lee', avatar: '/avatars/grace_lee.jpg' },
  { id: 9, name: 'Henry Wilson', avatar: '/avatars/henry_wilson.jpg' },
  { id: 10, name: 'Ivy Harris', avatar: '/avatars/ivy_harris.jpg' },
  { id: 11, name: 'Jack Turner', avatar: '/avatars/jack_turner.jpg' },
  { id: 12, name: 'Kara White', avatar: '/avatars/kara_white.jpg' },
  { id: 13, name: 'Liam Green', avatar: '/avatars/liam_green.jpg' },
  { id: 14, name: 'Mia Hall', avatar: '/avatars/mia_hall.jpg' },
  { id: 15, name: 'Noah Young', avatar: '/avatars/noah_young.jpg' },
];

const studentsGroup2: Student[] = [
  { id: 16, name: 'Olivia Wright', avatar: '/avatars/olivia_wright.jpg' },
  { id: 17, name: 'Paul Scott', avatar: '/avatars/paul_scott.jpg' },
  { id: 18, name: 'Quincy Adams', avatar: '/avatars/quincy_adams.jpg' },
  { id: 19, name: 'Rachel Baker', avatar: '/avatars/rachel_baker.jpg' },
  { id: 20, name: 'Samuel Carter', avatar: '/avatars/samuel_carter.jpg' },
  { id: 21, name: 'Tina Lopez', avatar: '/avatars/tina_lopez.jpg' },
  { id: 22, name: 'Uma Peterson', avatar: '/avatars/uma_peterson.jpg' },
  { id: 23, name: 'Victor Morgan', avatar: '/avatars/victor_morgan.jpg' },
  { id: 24, name: 'Willie Simmons', avatar: '/avatars/willie_simmons.jpg' },
  { id: 25, name: 'Xander Bell', avatar: '/avatars/xander_bell.jpg' },
  { id: 26, name: 'Yara Collins', avatar: '/avatars/yara_collins.jpg' },
  { id: 27, name: 'Zoe Rogers', avatar: '/avatars/zoe_rogers.jpg' },
  { id: 28, name: 'Aiden Perry', avatar: '/avatars/aiden_perry.jpg' },
  { id: 29, name: 'Bella Cooper', avatar: '/avatars/bella_cooper.jpg' },
  { id: 30, name: 'Caleb Hughes', avatar: '/avatars/caleb_hughes.jpg' },
];

interface RenderListProps {
  options: Student[];
  onTransfer: (students: Student[]) => void;
  type: 'forward' | 'backward';
  selectedStudents: Student[];
  onSelectStudent: (student: Student) => void;
}

function RenderList({
  options,
  onTransfer,
  type,
  selectedStudents,
  onSelectStudent,
}: RenderListProps) {
  const combobox = useCombobox();
  const [search, setSearch] = useState('');

  const handleValueSelect = (name: string) => {
    const student = options.find((option) => option.name === name);
    if (student) {
      onSelectStudent(student);
    }
  };

  const items = options
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item) => (
      <Combobox.Option
        value={item.name}
        key={item.id}
        active={selectedStudents.includes(item)}
        onMouseOver={() => combobox.resetSelectedOption()}
      >
        <Group gap="sm">
          <Checkbox
            checked={selectedStudents.includes(item)}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: 'none' }}
          />
          <Avatar src={item.avatar} alt={item.name} />
          <span>{item.name}</span>
        </Group>
      </Combobox.Option>
    ));

  const isSmallDevice = useMediaQuery('(max-width: 1045px)');

  return (
    <div className="renderList" data-type={type}>
      <Combobox
        store={combobox}
        onOptionSubmit={(value) => handleValueSelect(value)}
      >
        <Combobox.EventsTarget>
          <Group wrap="nowrap" gap={0} className="controls">
            <TextInput
              placeholder="Search students"
              classNames={{ input: 'input' }}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                combobox.updateSelectedOptionIndex();
              }}
              style={{ width: !isSmallDevice ? '350px' : '100%' }}
            />
          </Group>
        </Combobox.EventsTarget>

        <div className="list">
          <Combobox.Options>
            {items.length > 0 ? items : <Combobox.Empty>Nothing found....</Combobox.Empty>}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}

export function StudentPromotion() {
  const [data, setData] = useState<[Student[], Student[]]>([
    studentsGroup1,
    studentsGroup2,
  ]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [promoteToSession, setPromoteToSession] = useState<string | null>(null);
  const [promotionFromClass, setPromotionFromClass] = useState<string | null>(null);
  const [promotionToClass, setPromotionToClass] = useState<string | null>(null);
  const [selectedStudentsGroup1, setSelectedStudentsGroup1] = useState<Student[]>([]); // Track selected students in Group 1
  const [selectedStudentsGroup2, setSelectedStudentsGroup2] = useState<Student[]>([]); // Track selected students in Group 2


  const handleTransfer = (transferFrom: number, students: Student[]) =>
    setData((current) => {
      const transferTo = transferFrom === 0 ? 1 : 0;

      const transferFromData = current[transferFrom].filter(
        (student) => !students.includes(student)
      );

      const transferToData = [...current[transferTo], ...students];

      const result: [Student[], Student[]] = [[], []];
      result[transferFrom] = transferFromData;
      result[transferTo] = transferToData;

      return result;
    });

  const isSmallDevice = useMediaQuery('(max-width: 1024px)');

  const sessionOptions = [
    "2016 - 2017",
    "2017 - 2018",
    "2018 - 2019",
    "2019 - 2020",
    "2020 - 2021",
  ];

  const classOptions = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
  ];

  return (
    <Box
      className="root"
      sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}
    >
      <Typography variant={!isSmallDevice ? 'h4' : 'h5'} component="h3" sx={{ mb: '2rem' }}>
        Student Promotion Form
      </Typography>
      <Card sx={{ width: "100%", margin: "0 auto", padding: "20px", mb: '2rem' }}>
        <Title order={4} mb="lg">
          Search Student Promotion
        </Title>

        <Group>
          {/* Current Session */}
          <Select
            label="Current Session"
            placeholder="2017 - 2018"
            value={currentSession}
            onChange={setCurrentSession}
            data={sessionOptions}
          />

          {/* Promote To Session */}
          <Select
            label="Promote To Session"
            placeholder="2017 - 2018"
            value={promoteToSession}
            onChange={setPromoteToSession}
            data={sessionOptions}
          />

          {/* Promotion From Class */}
          <Select
            label="Promotion From Class"
            placeholder="Please Select"
            value={promotionFromClass}
            onChange={setPromotionFromClass}
            data={classOptions}
          />

          {/* Promotion To Class */}
          <Select
            label="Promotion To Class"
            placeholder="Please Select"
            value={promotionToClass}
            onChange={setPromotionToClass}
            data={classOptions}
          />
        </Group>

        {/* Search Button */}
        <Group style={{ marginTop: '1.3rem' }}>
          <Button
            onClick={() =>
              alert(
                `Current: ${currentSession}, To: ${promoteToSession}, From Class: ${promotionFromClass}, To Class: ${promotionToClass}`
              )
            }
            color="yellow"
          >
            Search
          </Button>
        </Group>
      </Card>

      <Card
        sx={{
          display: 'flex',
          flexDirection: !isSmallDevice ? 'row' : 'column',
          justifyContent: 'center',  // Center the action buttons
          alignItems: 'center',
        }}
      >
        {/* Group 1 */}
        <RenderList
          type="forward"
          options={data[0]}
          selectedStudents={selectedStudentsGroup1}
          onSelectStudent={(student) =>
            setSelectedStudentsGroup1((prev) =>
              prev.includes(student)
                ? prev.filter((s) => s.id !== student.id)
                : [...prev, student]
            )
          }
          onTransfer={(students) => handleTransfer(0, students)}
        />

        {/* Transfer Arrows (Only in the center) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
          }}
        >
          <ActionIcon
            radius="xl"
            variant="filled"
            size={50}
            onClick={() => handleTransfer(0, selectedStudentsGroup1)}
            style={{ marginBottom: !isSmallDevice ? '8px' : '0' }}
          >
            <ChevronRightIcon />
          </ActionIcon>
          <ActionIcon
            radius="xl"
            variant="filled"
            size={50}
            onClick={() => handleTransfer(1, selectedStudentsGroup2)}
          >
            <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
          </ActionIcon>
        </Box>

        {/* Group 2 */}
        <RenderList
          type="backward"
          options={data[1]}
          selectedStudents={selectedStudentsGroup2}
          onSelectStudent={(student) =>
            setSelectedStudentsGroup2((prev) =>
              prev.includes(student)
                ? prev.filter((s) => s.id !== student.id)
                : [...prev, student]
            )
          }
          onTransfer={(students) => handleTransfer(1, students)}
        />
      </Card>
      <Box sx={{mt:'2rem', display:'flex', gap:'1rem', justifyContent:'end'}}>
          <MainButton variant='contained' size='large'>Save</MainButton>
          <MainButton variant='contained' size='large' color='error'>Reset</MainButton>
        </Box>
    </Box>
  );
}
