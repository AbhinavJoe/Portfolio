import { render, screen, waitFor } from "@testing-library/react";
import { MermaidDiagram } from "../mermaid-diagram";

jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: "<svg data-testid='mermaid-svg'></svg>" }),
  },
}));

describe("MermaidDiagram", () => {
  it("renders a container that mermaid can mount into", async () => {
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    expect(screen.getByTestId("mermaid-container")).toBeInTheDocument();
    // flush the mocked mermaid.render().then(...) microtask so the
    // resulting setSvg state update happens inside act()
    await waitFor(() => {});
  });
});
