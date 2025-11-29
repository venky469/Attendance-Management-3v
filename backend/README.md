# Backend (Placeholder)

This folder is reserved for the dedicated backend service (e.g., NestJS/Express/Fastify) to be implemented after frontend completion.

Planned responsibilities:
- Replace mock in-memory API routes with real database and authentication.
- Integrate Cloudinary server-side signatures for secure uploads.
- Provide face template storage and recognition services (if moved server-side).
- Expose REST/GraphQL endpoints consumed by the Next.js frontend.

Note: For now, the Next.js app has working API routes backed by mock data in-memory so you can use the product end-to-end.




// //  useEffect(() => {
// //   // Disable right-click
// //   const handleContextMenu = (e: MouseEvent) => {
// //     e.preventDefault();
// //     // alert('Right-click is disabled for security reasons.');
// //   };

// //   // Disable inspect shortcuts
// //   const handleKeyDown = (e: KeyboardEvent) => {
// //     if (
// //       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
// //       e.key === 'F12'
// //     ) {
// //       e.preventDefault();
// //       // alert('Developer tools are disabled for this application.');
// //     }
// //   };

// //   // Detect if DevTools is open and close window
// //   const detectDevTools = () => {
// //     const threshold = 160;
// //     const widthThreshold = window.outerWidth - window.innerWidth > threshold;
// //     const heightThreshold = window.outerHeight - window.innerHeight > threshold;

// //     if (widthThreshold || heightThreshold) {
// //       // alert('Developer tools detected. The window will be closed for security reasons.');
// //       window.close();

// //       // As a fallback for browsers that block window.close()
// //       document.body.innerHTML =
// //         '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:20px;color:red;">⚠️ Developer tools detected. Please ***  Close Inspect Page  *** and reopen the page.</div>';
// //     }
// //   };

// //   // Check every second
// //   const interval = setInterval(detectDevTools, 1000);
  

// //   // Add listeners
// //   document.addEventListener('contextmenu', handleContextMenu);
// //   document.addEventListener('keydown', handleKeyDown);

// //   // Cleanup
// //   return () => {
// //     document.removeEventListener('contextmenu', handleContextMenu);
// //     document.removeEventListener('keydown', handleKeyDown);
// //     clearInterval(interval);
// //   };
// // }, []);






<!-- http://localhost:3000/api/seed -->

POST http://localhost:3000/api/seed

{
  "staff": [
    {
      "name": "Admin User",
      "email": "admin@genamplify.com",
      "password": "admin123",
      "phone": "+91-9876543210",
      "department": "Administration",
      "role": "Admin",
      "shift": "Morning",
      "address": "123 Admin Street, City",
      "dateOfBirth": "1985-01-15",
      "dateOfJoining": "2020-01-01"
    },
    {
      "name": "John Smith",
      "email": "john.smith@genamplify.com",
      "password": "staff123",
      "phone": "+91-9876543211",
      "department": "Computer Science",
      "role": "Professor",
      "shift": "Morning",
      "address": "456 Faculty Lane, City",
      "dateOfBirth": "1980-05-20",
      "dateOfJoining": "2021-06-15"
    },
    {
      "name": "Sarah Johnson",
      "email": "sarah.johnson@genamplify.com",
      "password": "staff123",
      "phone": "+91-9876543212",
      "department": "Mathematics",
      "role": "Assistant Professor",
      "shift": "Afternoon",
      "address": "789 Teacher Road, City",
      "dateOfBirth": "1988-03-10",
      "dateOfJoining": "2022-01-10"
    }
  ],
  "students": [
    {
      "name": "Alice Brown",
      "email": "alice.brown@student.genamplify.com",
      "password": "student123",
      "phone": "+91-9876543213",
      "department": "Computer Science",
      "role": "Student",
      "shift": "Morning",
      "parentName": "Robert Brown",
      "address": "321 Student Avenue, City",
      "dateOfBirth": "2002-08-15",
      "dateOfJoining": "2023-07-01",
      "academicYear": "2023-24",
      "classLevel": "First Year"
    },
    {
      "name": "Bob Wilson",
      "email": "bob.wilson@student.genamplify.com",
      "password": "student123",
      "phone": "+91-9876543214",
      "department": "Mathematics",
      "role": "Student",
      "shift": "Morning",
      "parentName": "Mary Wilson",
      "address": "654 Learning Street, City",
      "dateOfBirth": "2001-12-05",
      "dateOfJoining": "2022-07-01",
      "academicYear": "2023-24",
      "classLevel": "Second Year"
    },
    {
      "name": "Carol Davis",
      "email": "carol.davis@student.genamplify.com",
      "password": "student123",
      "phone": "+91-9876543215",
      "department": "Physics",
      "role": "Student",
      "shift": "Afternoon",
      "parentName": "James Davis",
      "address": "987 Education Blvd, City",
      "dateOfBirth": "2003-04-22",
      "dateOfJoining": "2023-07-01",
      "academicYear": "2023-24",
      "classLevel": "First Year"
    }
  ]
}
