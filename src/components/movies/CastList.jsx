import { Box, Avatar, Typography } from "@mui/material";
import { profileUrl } from "../../utils/imageUrl";

export default function CastList({ cast = [] }) {
  if (!cast.length)
    return (
      <Typography color="text.secondary">
        Cast information unavailable.
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
      {cast.slice(0, 10).map((person) => (
        <Box
          key={person.cast_id ?? person.id}
          sx={{ minWidth: 90, textAlign: "center" }}
        >
          <Avatar
            src={profileUrl(person.profile_path)}
            alt={person.name}
            sx={{ width: 80, height: 80, mx: "auto" }}
          />
          <Typography
            variant="caption"
            fontWeight={600}
            display="block"
            sx={{ mt: 0.5 }}
          >
            {person.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {person.character}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
