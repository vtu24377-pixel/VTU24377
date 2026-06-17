import { Card, CardContent, Typography } from "@mui/material";

export default function NotificationCard({ notification }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {notification.Type}
        </Typography>

        <Typography>
          {notification.Message}
        </Typography>

        <Typography variant="caption">
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}