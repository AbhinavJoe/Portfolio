import { render, screen } from "@testing-library/react";
import { MermaidDiagram } from "../mermaid-diagram";

jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: "<svg data-testid='mermaid-svg'></svg>" }),
  },
}));

describe("MermaidDiagram", () => {
  it("renders a container that mermaid can mount into", () => {
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    expect(screen.getByTestId("mermaid-container")).toBeInTheDocument();
  });
});
