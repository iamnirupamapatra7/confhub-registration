import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AccordionSection from "../components/AccordionSection";

const meta: Meta<typeof AccordionSection> = {
  title: "Components/AccordionSection",
  component: AccordionSection,
  parameters: { layout: "padded" },
  argTypes: {
    theme: { control: "radio", options: ["light", "dark"] },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionSection>;

export const Open: Story = {
  args: {
    id: "contact",
    title: "Organizer details",
    isActive: true,
    hasError: false,
    theme: "light",
    children: <p className="text-sm text-gray-500">Section content goes here.</p>,
  },
};

export const Closed: Story = {
  args: {
    ...Open.args,
    isActive: false,
  },
};

export const WithValidationError: Story = {
  args: {
    ...Open.args,
    isActive: false,
    hasError: true,
  },
};

export const DarkTheme: Story = {
  args: {
    ...Open.args,
    theme: "dark",
  },
};
