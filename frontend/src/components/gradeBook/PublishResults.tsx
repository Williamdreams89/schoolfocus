import React from "react";
import {
  Box,
  Text,
  Group,
  Button,
  Select,
  TextInput,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Card } from "@mui/material";

const PublishResultForm: React.FC = () => {
  const form = useForm({
    initialValues: {
      class: "",
      division: "",
      publishAs: "end-term",
      nextTerm: "",
      academicSession: "",
      nextTermResumption: "",
      useDefaultSettings: "true", // Stored as a string
      updateFormTeacherInfo: false,
      updateAdminInfo: false,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const resultData = {
      ...values,
      useDefaultSettings: values.useDefaultSettings === "true", // Convert to boolean
    };
    console.log("Form Data Submitted:", resultData);
  };

  return (
    <Card
      style={{
        width: "100%",
        
      }}
    >
      <Text size="lg" style={{fontWeight: 700}} mb="md">
        Publish Result
      </Text>

      {/* Class and Division */}
      <Group grow mb="md">
        <Select
          label="Class"
          placeholder="Select class"
          data={[
            { value: "JS2", label: "JS2" },
            { value: "JS3", label: "JS3" },
            { value: "SS1", label: "SS1" },
          ]}
          {...form.getInputProps("class")}
        />
        <Select
          label="Class Arm / Division"
          placeholder="Select division"
          data={[
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "C", label: "C" },
          ]}
          {...form.getInputProps("division")}
        />
      </Group>

      {/* Publish As */}
      <RadioGroup
        label="Publish Result As"
        {...form.getInputProps("publishAs")}
        mb="md"
      >
        <Radio value="mid-term" label="Mid Term Report" />
        <Radio value="end-term" label="End of Term Report" />
      </RadioGroup>

      {/* Next Term Information */}
      <Group grow mb="md">
        <Select
          label="Next Term"
          placeholder="Select next term"
          data={[
            { value: "First Term", label: "First Term" },
            { value: "Second Term", label: "Second Term" },
            { value: "Third Term", label: "Third Term" },
          ]}
          {...form.getInputProps("nextTerm")}
        />
        <Select
          label="Academic Session"
          placeholder="Select academic session"
          data={[
            { value: "2023/2024", label: "2023/2024" },
            { value: "2024/2025", label: "2024/2025" },
            { value: "2025/2026", label: "2025/2026" },
          ]}
          {...form.getInputProps("academicSession")}
        />
      </Group>

      {/* Next Term Resumption Date */}
      <TextInput
        label="Next Term's Resumption Date"
        type="date"
        {...form.getInputProps("nextTermResumption")}
        mb="md"
      />

      {/* Result Page Preferences */}
      <RadioGroup
        label="Result Page Preferences"
        {...form.getInputProps("useDefaultSettings")}
        mb="md"
      >
        <Radio value="true" label="Use Default Settings" />
        <Radio value="false" label="Use Custom Settings" />
      </RadioGroup>

      {/* Update Information */}
      <Text mb="sm">
        This result had been published at least once before now. Do you wish to
        update the information?
      </Text>
      <Checkbox
        label="Update Form Teacher Info on Results"
        {...form.getInputProps("updateFormTeacherInfo", { type: "checkbox" })}
        mb="xs"
      />
      <Checkbox
        label="Update School (Admin) Head Info on Results"
        {...form.getInputProps("updateAdminInfo", { type: "checkbox" })}
        mb="md"
      />

      {/* Buttons */}
      <Group justify="flex-end">
        <Button variant="default">Close</Button>
        <Button onClick={() => handleSubmit(form.values)}>Publish</Button>
      </Group>
    </Card>
  );
};

export default PublishResultForm;
