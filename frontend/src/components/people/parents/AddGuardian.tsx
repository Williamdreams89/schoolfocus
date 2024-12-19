import React, { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Select,
  Box,
  PasswordInput,
  Textarea,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
// import { IconTrash, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { Card } from "@mui/material";

interface Guardian {
  fullName: string;
  relationship: string;
  occupation: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  temporaryEmail: boolean;
  autoGeneratePassword: boolean;
}

const AddGuardianForm: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      fullName: "",
      relationship: "Father",
      occupation: "",
      phone: "",
      address: "",
      email: "",
      password: "",
      temporaryEmail: false,
      autoGeneratePassword: false,
    },
  ]);

  // Add a new guardian to the form
  const addGuardian = () => {
    setGuardians([
      ...guardians,
      {
        fullName: "",
        relationship: "Father",
        occupation: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        temporaryEmail: false,
        autoGeneratePassword: false,
      },
    ]);
  };

  // Remove a guardian from the form
  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://api.example.com/guardians", {
        guardians,
      });
      alert("Guardians successfully added!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting guardians:", error);
    }
  };

  return (
    <Card sx={{width:'100%'}}>
      {guardians.map((guardian, index) => (
        <Box
          key={index}
        >
          <Group>
            <h4>{guardian.relationship}</h4>
            {guardians.length > 1 && (
              <ActionIcon
                color="red"
                onClick={() => removeGuardian(index)}
                size="lg"
              >
                {/* <IconTrash /> */}
              </ActionIcon>
            )}
          </Group>

          <Group grow>
            <TextInput
              label="Full Name"
              placeholder="Full Name"
              required
              value={guardian.fullName}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, fullName: e.target.value } : g
                  )
                )
              }
            />
            <Select
              label="Relationship (with ward(s))"
              placeholder="Relationship"
              required
              value={guardian.relationship}
              onChange={(value) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, relationship: value || "" } : g
                  )
                )
              }
              data={["Father", "Mother", "Guardian"]}
            />
            <TextInput
              label="Occupation"
              placeholder="Occupation"
              value={guardian.occupation}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, occupation: e.target.value } : g
                  )
                )
              }
            />
          </Group>

          <Group grow mt="md">
            <TextInput
              label="Phone"
              placeholder="Phone"
              required
              value={guardian.phone}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, phone: e.target.value } : g
                  )
                )
              }
            />
            <Textarea
              label="Address"
              placeholder="Address"
              value={guardian.address}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, address: e.target.value } : g
                  )
                )
              }
            />
          </Group>

          <Group grow mt="md">
            <TextInput
              label="Email"
              placeholder="Email"
              required
              value={guardian.email}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, email: e.target.value } : g
                  )
                )
              }
              disabled={guardian.temporaryEmail}
            />
            <PasswordInput
              label="Create Account Password"
              placeholder="Password"
              required
              value={guardian.password}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index ? { ...g, password: e.target.value } : g
                  )
                )
              }
              disabled={guardian.autoGeneratePassword}
            />
          </Group>

          <Group mt="md">
            <Checkbox
              label="Use Temporary Email Address"
              checked={guardian.temporaryEmail}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index
                      ? { ...g, temporaryEmail: e.target.checked }
                      : g
                  )
                )
              }
            />
            <Checkbox
              label="Auto Generate Password"
              checked={guardian.autoGeneratePassword}
              onChange={(e) =>
                setGuardians(
                  guardians.map((g, i) =>
                    i === index
                      ? { ...g, autoGeneratePassword: e.target.checked }
                      : g
                  )
                )
              }
            />
          </Group>
        </Box>
      ))}

      <Group mt="md">
        <Button
        //   leftIcon={<IconPlus />}
          variant="outline"
          onClick={addGuardian}
        >
          Add Guardian
        </Button>
      </Group>

      <Group mt="lg">
        <Button onClick={handleSubmit} color="blue">
          Save
        </Button>
      </Group>
    </Card>
  );
};

export default AddGuardianForm;
