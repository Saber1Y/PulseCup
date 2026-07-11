import type { TxLINEFixture } from "@/lib/types";

function dateStr(month: number, day: number, hour = 16, min = 0): string {
  return new Date(2026, month - 1, day, hour, min).toISOString();
}

const WC26_FIXTURES: TxLINEFixture[] = [
  // Group A — finished group stage
  { id: 1001, competitionId: 1, competition: "World Cup 2026 · Group A", homeTeam: "Mexico", awayTeam: "Canada", startDate: dateStr(6, 11, 18), status: "finished" },
  { id: 1002, competitionId: 1, competition: "World Cup 2026 · Group A", homeTeam: "Italy", awayTeam: "Mexico", startDate: dateStr(6, 15, 15), status: "finished" },
  { id: 1003, competitionId: 1, competition: "World Cup 2026 · Group A", homeTeam: "Canada", awayTeam: "Italy", startDate: dateStr(6, 19, 18), status: "finished" },

  // Group B
  { id: 1004, competitionId: 1, competition: "World Cup 2026 · Group B", homeTeam: "Argentina", awayTeam: "Nigeria", startDate: dateStr(6, 12, 15), status: "finished" },
  { id: 1005, competitionId: 1, competition: "World Cup 2026 · Group B", homeTeam: "South Korea", awayTeam: "Argentina", startDate: dateStr(6, 16, 18), status: "finished" },
  { id: 1006, competitionId: 1, competition: "World Cup 2026 · Group B", homeTeam: "Nigeria", awayTeam: "South Korea", startDate: dateStr(6, 20, 15), status: "finished" },

  // Group C
  { id: 1007, competitionId: 1, competition: "World Cup 2026 · Group C", homeTeam: "France", awayTeam: "Senegal", startDate: dateStr(6, 13, 18), status: "finished" },
  { id: 1008, competitionId: 1, competition: "World Cup 2026 · Group C", homeTeam: "Japan", awayTeam: "France", startDate: dateStr(6, 17, 15), status: "finished" },
  { id: 1009, competitionId: 1, competition: "World Cup 2026 · Group C", homeTeam: "Senegal", awayTeam: "Japan", startDate: dateStr(6, 21, 18), status: "finished" },

  // Group D
  { id: 1010, competitionId: 1, competition: "World Cup 2026 · Group D", homeTeam: "Brazil", awayTeam: "Croatia", startDate: dateStr(6, 14, 15), status: "finished" },
  { id: 1011, competitionId: 1, competition: "World Cup 2026 · Group D", homeTeam: "Australia", awayTeam: "Brazil", startDate: dateStr(6, 18, 18), status: "finished" },
  { id: 1012, competitionId: 1, competition: "World Cup 2026 · Group D", homeTeam: "Croatia", awayTeam: "Australia", startDate: dateStr(6, 22, 15), status: "finished" },

  // Group E
  { id: 1013, competitionId: 1, competition: "World Cup 2026 · Group E", homeTeam: "Spain", awayTeam: "Morocco", startDate: dateStr(6, 12, 18), status: "finished" },
  { id: 1014, competitionId: 1, competition: "World Cup 2026 · Group E", homeTeam: "USA", awayTeam: "Spain", startDate: dateStr(6, 16, 15), status: "finished" },
  { id: 1015, competitionId: 1, competition: "World Cup 2026 · Group E", homeTeam: "Morocco", awayTeam: "USA", startDate: dateStr(6, 20, 18), status: "finished" },

  // Group F
  { id: 1016, competitionId: 1, competition: "World Cup 2026 · Group F", homeTeam: "England", awayTeam: "Uruguay", startDate: dateStr(6, 13, 15), status: "finished" },
  { id: 1017, competitionId: 1, competition: "World Cup 2026 · Group F", homeTeam: "Ivory Coast", awayTeam: "England", startDate: dateStr(6, 17, 18), status: "finished" },
  { id: 1018, competitionId: 1, competition: "World Cup 2026 · Group F", homeTeam: "Uruguay", awayTeam: "Ivory Coast", startDate: dateStr(6, 21, 15), status: "finished" },

  // Group G
  { id: 1019, competitionId: 1, competition: "World Cup 2026 · Group G", homeTeam: "Germany", awayTeam: "Saudi Arabia", startDate: dateStr(6, 14, 18), status: "finished" },
  { id: 1020, competitionId: 1, competition: "World Cup 2026 · Group G", homeTeam: "Ecuador", awayTeam: "Germany", startDate: dateStr(6, 18, 15), status: "finished" },
  { id: 1021, competitionId: 1, competition: "World Cup 2026 · Group G", homeTeam: "Saudi Arabia", awayTeam: "Ecuador", startDate: dateStr(6, 22, 18), status: "finished" },

  // Group H
  { id: 1022, competitionId: 1, competition: "World Cup 2026 · Group H", homeTeam: "Portugal", awayTeam: "Ghana", startDate: dateStr(6, 11, 15), status: "finished" },
  { id: 1023, competitionId: 1, competition: "World Cup 2026 · Group H", homeTeam: "Netherlands", awayTeam: "Portugal", startDate: dateStr(6, 15, 18), status: "finished" },
  { id: 1024, competitionId: 1, competition: "World Cup 2026 · Group H", homeTeam: "Ghana", awayTeam: "Netherlands", startDate: dateStr(6, 19, 15), status: "finished" },

  // Round of 16 — some finished, some live
  { id: 1025, competitionId: 1, competition: "World Cup 2026 · Round of 16", homeTeam: "Mexico", awayTeam: "Argentina", startDate: dateStr(6, 28, 18), status: "finished" },
  { id: 1026, competitionId: 1, competition: "World Cup 2026 · Round of 16", homeTeam: "France", awayTeam: "Brazil", startDate: dateStr(6, 29, 15), status: "finished" },
  { id: 1027, competitionId: 1, competition: "World Cup 2026 · Round of 16", homeTeam: "Spain", awayTeam: "England", startDate: dateStr(6, 30, 18), status: "finished" },
  { id: 1028, competitionId: 1, competition: "World Cup 2026 · Round of 16", homeTeam: "Germany", awayTeam: "Portugal", startDate: dateStr(7, 1, 15), status: "finished" },

  // Quarterfinals — some finished, one upcoming/live
  { id: 1029, competitionId: 1, competition: "World Cup 2026 · Quarterfinal", homeTeam: "Argentina", awayTeam: "France", startDate: dateStr(7, 4, 18), status: "finished" },
  { id: 1030, competitionId: 1, competition: "World Cup 2026 · Quarterfinal", homeTeam: "Spain", awayTeam: "Germany", startDate: dateStr(7, 5, 15), status: "finished" },
  { id: 1031, competitionId: 1, competition: "World Cup 2026 · Quarterfinal", homeTeam: "Brazil", awayTeam: "Italy", startDate: dateStr(7, 6, 18), status: "finished" },
  { id: 1032, competitionId: 1, competition: "World Cup 2026 · Quarterfinal", homeTeam: "England", awayTeam: "Portugal", startDate: dateStr(7, 7, 15), status: "finished" },

  // Semifinals — one finished, one live today
  { id: 1033, competitionId: 1, competition: "World Cup 2026 · Semifinal", homeTeam: "Argentina", awayTeam: "Spain", startDate: dateStr(7, 10, 18), status: "finished" },
  { id: 1034, competitionId: 1, competition: "World Cup 2026 · Semifinal", homeTeam: "Italy", awayTeam: "England", startDate: dateStr(7, 11, 18), status: "live" },

  // Final — upcoming
  { id: 1035, competitionId: 1, competition: "World Cup 2026 · Final", homeTeam: "Argentina", awayTeam: "TBD", startDate: dateStr(7, 19, 16), status: "upcoming" },
];

export default WC26_FIXTURES;
