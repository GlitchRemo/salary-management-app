import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type SummaryCardProps = {
  title: string;
  value: string;
};

export function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, mb: 1 }}
        >
          {title}
        </Typography>
        <Box>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
