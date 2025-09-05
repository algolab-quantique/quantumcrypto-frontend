# Plan: Migrating Content to Markdown (MDX)

This document outlines the strategy and steps to migrate the website's informational content from a TypeScript dictionary (`quantumcrypto-lines.ts`) to individual Markdown (MDX) files.

### **Why Migrate?**

*   **Maintainability**: Content is easier to read, write, and update in Markdown than inside JavaScript strings.
*   **Separation of Concerns**: It separates the content (the "what") from the presentation (the "how"). Your React components handle the layout, and Markdown files handle the text.
*   **Better for Rich Content**: Markdown is ideal for articles containing paragraphs, headings, links, images, and code blocks.

---

### **Why MDX over plain Markdown (.md)?**

While plain Markdown is great for simple text, **MDX is essential for a modern React-based website** like this one. Here's why:

*   **Standard Markdown is not enough for our needs.** We need to handle features like:
    *   **Themed Images:** Displaying different images for light and dark mode.
    *   **Custom Components:** Using specially styled links or interactive elements.
*   **MDX is Markdown + React.** It allows us to write standard Markdown syntax and also `import` and use our own React components directly inside the content file. For example, we can create a `<ThemedImage>` component and use it in our `.mdx` file to solve the light/dark mode problem.

---

### **The Plan: A Phased Approach**

We will migrate the content piece by piece to ensure a smooth transition. We'll start with the "About" section for the BB84 protocol.

#### **Phase 1: Setup and Configuration**

1.  **Install Dependencies**: We need libraries to process MDX files in Next.js.
    *   `next-mdx-remote`: To render MDX content on the page.
    *   `gray-matter`: To parse metadata (like a title) from the top of the markdown files.

2.  **Configure Next.js**: We may need to update `next.config.js` to properly handle MDX files if we choose a specific setup.

#### **Phase 2: Migrating the BB84 "About" Content**

**Step 1: Create the First MDX File**

*   We will create a new file at: `content/en/bb84-about.mdx`. (Note the `.mdx` extension).
*   We will copy the existing English content for the BB84 "About" section from `lang/quantumcrypto-lines.ts` into this new file.
*   We will add a "frontmatter" block at the top for metadata.

    ```mdx
    ---
    title: 'About the BB84 Protocol'
    ---

    The BB84 protocol was proposed in 1984 by Charles Bennett...
    ...It involves two distinct parties, Alice and Bob...
    ```

**Step 2: Create a Content Loading Utility**

*   Create a new file, for example `lib/content-loader.ts`.
*   This file will contain a function that:
    1.  Takes a `protocol` (e.g., 'bb84') and a `lang` (e.g., 'en') as arguments.
    2.  Reads the corresponding `.mdx` file from the `content/` directory.
    3.  Uses `gray-matter` to parse the frontmatter and the main content.
    4.  Returns the content ready to be rendered.

**Step 3: Update the BB84 Page to Use the New Content**

*   We will edit the `app/(main)/bb84/page.tsx` file.
*   Instead of calling `localize('component.bb84.about.part1')`, this page will now:
    1.  Call our new content loading function to get the MDX content for the current language.
    2.  Use the `<MDXRemote />` component (from `next-mdx-remote`) to render the content onto the page.

**Step 4: Handle Custom Components (e.g., Links and Math)**

*   **How are links like `[text](url)` rendered?**
    When we process the MDX file, the `[encryption key](definitions.md#encryption-key)` syntax is first converted into a standard HTML `<a>` tag. However, the `next-mdx-remote` library gives us a powerful feature: we can provide a list of "components" to replace the default HTML elements.
    We can tell it: "Hey, whenever you see an `<a>` tag, don't use the default one. Instead, use *my* custom React link component." This allows us to:
    1.  Use Next.js's `<Link>` component for fast, client-side navigation.
    2.  Apply custom styles to make the links match the website's design.
    3.  Add pop-up definitions or other interactive features.

*   **Math Equations:** For math equations, we can configure MDX to automatically find LaTeX expressions and render them beautifully using a library like `rehype-katex`.

#### **Phase 3: Expand to Other Languages and Protocols**

*   Once the English BB84 "About" page is working, we will repeat the process:
    1.  Create `content/fr/bb84-about.mdx` and `content/es/bb84-about.mdx`.
    2.  Migrate the "How to Play" sections for BB84.
    3.  Move on to the E91 and DPS protocols, following the same pattern.

This step-by-step process will allow us to safely and efficiently modernize the content management of the website.
