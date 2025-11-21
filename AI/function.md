# Function: Home Page (`/home`)

## Purpose
This page serves as the dashboard after login.  
It displays all projects belonging to the logged-in user,  
and allows creating and deleting projects.

## Scope
This feature includes:
- Implement `/home` page UI and logic
- Redirect users not logged in to `/`
- List projects filtered by the current user
- Create new projects (with dialog)
- Delete projects (simple UI)
- Apply translations (jp/en/fr)
- Use CSV repository and logic layer
- Logic tests will be added after PR

---

## Page Behavior

### Auth Redirect
- Read `userId` from `localStorage`
- If missing → `router.replace("/")`

### Project Listing
- Call: `listProjects(userId)`
- Order by ascending `order`
- Display each project as a Card
- Empty state is shown with a create button

### Create Project
- Button → opens a Dialog
- Call: `createProject(name, userId)`
- Refresh the list after creation

### Project Card
- Display project name + created_at
- (Navigation to boards will be added later)

### Header
- Left: Language dropdown
- Right: Logout button (remove userId → `/`)

---

## CSV Schema (`db/projects.csv`)
id, user_id, name, created_at, updated_at, order

yaml
Copy code

**Rules**
- `id`: UUIDv4  
- `user_id`: id of the logged-in user  
- `name`: string  
- `order`: number (display order)  
- `created_at` / `updated_at`: ISO string  
- UTF-8, LF (`\n`)  
- No double quotes  
- No NULL (empty string allowed)

---

## Type Definitions (`types/project.ts`)
```ts
export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}
Repository (logic/projectRepository.ts)
listProjects(userId: string): Result<Project[]>
Load CSV

Filter by userId

Sort by order

Return Result.error on failure

createProject(name: string, userId: string): Result<Project>
Generate id (UUIDv4)

Determine next order (last + 1)

Set createdAt & updatedAt = now()

Append to CSV

Return created project

deleteProject(id: string, userId: string): Result<null>
Remove row matching id & userId

Rebuild the CSV without that row

Return null

Components
components/project/ProjectCard.tsx
Shows project name + created_at using shadcn/ui Card

components/project/ProjectCreateDialog.tsx
Input for name

Cancel / Create buttons

components/ui/Header.tsx
Language selector

Logout button

Translations (required keys)
lua
Copy code
projects.title
projects.create
projects.create_button
projects.name_placeholder
projects.empty
projects.logout
projects.created_at
Routing
arduino
Copy code
/home   → Project list page
Tests (added after PR)
Unit Tests (logic)
createProject: id, timestamps, order

listProjects: filtering by userId

deleteProject: row removal

Repository Tests
CSV read/write

Order handling

Integration Tests
create → list → delete flow

Out of Scope
Boards, Lists, Tasks

Project renaming

Project detail page

Drag & Drop

UI design polish

Notes
This function.md defines only the /home (project list) feature.

Additional features must be added as new branches with new function.md files.