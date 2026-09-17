import { render, screen, fireEvent } from "@testing-library/react";
import AccordionSection from "../AccordionSection";

describe("AccordionSection", () => {
  const defaultProps = {
    id: "section-1",
    title: "Test title",
    children: <div>Test content</div>,
    onToggle: jest.fn(),
  };

  it("renders the title and content", () => {
    render(<AccordionSection {...defaultProps} isActive={true} />);
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByTestId("accordion-content")).toBeInTheDocument();
  });

  it("hides content when inactive", () => {
    render(<AccordionSection {...defaultProps} isActive={false} />);
    expect(screen.getByTestId("accordion-content")).toHaveClass("hidden");
  });

  it("calls onToggle when the header is clicked", () => {
    const onToggle = jest.fn();
    render(<AccordionSection {...defaultProps} isActive={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows an error dot when hasError is true", () => {
    render(<AccordionSection {...defaultProps} isActive={true} hasError={true} />);
    expect(screen.getByTestId("section-1-error-dot")).toBeInTheDocument();
  });

  it("does not show an error dot when there is no error", () => {
    render(<AccordionSection {...defaultProps} isActive={true} hasError={false} />);
    expect(screen.queryByTestId("section-1-error-dot")).not.toBeInTheDocument();
  });

  it("applies rounded corners for first and last sections", () => {
    const { container } = render(
      <AccordionSection {...defaultProps} isFirst isLast isActive={true} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/rounded-t-xl/);
    expect(wrapper.className).toMatch(/rounded-b-xl/);
  });
});
