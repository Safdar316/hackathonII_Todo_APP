"""Console client for the Todo API."""
import httpx

BASE_URL = "http://localhost:8000"


def add_todo() -> None:
    """Add a new todo by prompting for title and description."""
    title = input("Enter todo title: ").strip()
    if not title:
        print("Error: Title cannot be empty")
        return

    description = input("Enter description (optional, press Enter to skip): ").strip()
    description = description if description else None

    try:
        response = httpx.post(
            f"{BASE_URL}/todos",
            json={"title": title, "description": description}
        )
        response.raise_for_status()
        todo = response.json()
        print(f"✓ Todo created with ID: {todo['id']}")
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Unknown error')}")


def list_todos() -> None:
    """List all todos."""
    try:
        response = httpx.get(f"{BASE_URL}/todos")
        response.raise_for_status()
        todos = response.json()

        if not todos:
            print("No todos found.")
            return

        print("\n--- All Todos ---")
        for todo in todos:
            status = "Yes" if todo["completed"] else "No"
            print(f"ID: {todo['id']} | Title: {todo['title']} | Completed: {status}")
        print()
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Unknown error')}")


def view_todo() -> None:
    """View a single todo by ID."""
    try:
        todo_id = int(input("Enter todo ID: ").strip())
    except ValueError:
        print("Error: Please enter a valid number")
        return

    try:
        response = httpx.get(f"{BASE_URL}/todos/{todo_id}")
        response.raise_for_status()
        todo = response.json()

        print(f"\n--- Todo Details ---")
        print(f"ID: {todo['id']}")
        print(f"Title: {todo['title']}")
        print(f"Description: {todo['description'] or 'N/A'}")
        print(f"Completed: {'Yes' if todo['completed'] else 'No'}")
        print(f"Created: {todo['created_at']}")
        print()
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Todo not found')}")


def update_todo() -> None:
    """Update a todo by ID."""
    try:
        todo_id = int(input("Enter todo ID to update: ").strip())
    except ValueError:
        print("Error: Please enter a valid number")
        return

    print("Leave blank to keep current value:")
    title = input("New title: ").strip()
    description = input("New description: ").strip()

    update_data = {}
    if title:
        update_data["title"] = title
    if description:
        update_data["description"] = description

    if not update_data:
        print("No changes provided.")
        return

    try:
        response = httpx.put(f"{BASE_URL}/todos/{todo_id}", json=update_data)
        response.raise_for_status()
        print(f"✓ Todo {todo_id} updated successfully")
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Todo not found')}")


def mark_complete() -> None:
    """Mark a todo as completed."""
    try:
        todo_id = int(input("Enter todo ID to mark complete: ").strip())
    except ValueError:
        print("Error: Please enter a valid number")
        return

    try:
        response = httpx.put(f"{BASE_URL}/todos/{todo_id}", json={"completed": True})
        response.raise_for_status()
        print(f"✓ Todo {todo_id} marked as completed")
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Todo not found')}")


def delete_todo() -> None:
    """Delete a todo by ID."""
    try:
        todo_id = int(input("Enter todo ID to delete: ").strip())
    except ValueError:
        print("Error: Please enter a valid number")
        return

    try:
        response = httpx.delete(f"{BASE_URL}/todos/{todo_id}")
        response.raise_for_status()
        print(f"✓ Todo {todo_id} deleted successfully")
    except httpx.ConnectError:
        print("Error: Cannot connect to server. Is it running?")
    except httpx.HTTPStatusError as e:
        print(f"Error: {e.response.json().get('detail', 'Todo not found')}")


def display_menu() -> None:
    """Display the main menu."""
    print("\n=== Todo Application ===")
    print("1. Add todo")
    print("2. View all todos")
    print("3. View todo by ID")
    print("4. Update todo")
    print("5. Mark todo as completed")
    print("6. Delete todo")
    print("7. Exit")


def main() -> None:
    """Main function with menu loop."""
    print("Welcome to the Todo Application!")
    print("Make sure the API server is running on http://localhost:8000")

    while True:
        display_menu()
        choice = input("\nSelect an option (1-7): ").strip()

        if choice == "1":
            add_todo()
        elif choice == "2":
            list_todos()
        elif choice == "3":
            view_todo()
        elif choice == "4":
            update_todo()
        elif choice == "5":
            mark_complete()
        elif choice == "6":
            delete_todo()
        elif choice == "7":
            print("Goodbye!")
            break
        else:
            print("Error: Invalid option. Please enter a number between 1 and 7.")


if __name__ == "__main__":
    main()
