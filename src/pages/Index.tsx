import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type MatchStatus = 'finished' | 'live' | 'upcoming';

interface Match {
  id: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  time: string;
  minute?: number;
}

interface Player {
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  age: number;
  goals?: number;
  assists?: number;
  rating?: number;
  losses?: number;
  kpi?: number;
}

interface TeamStats {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

const allDivisions = {
  'Север': {
    'A': ['Murmansk', 'Helsinki', 'Stockholm', 'Bergen'],
    'B': ['Glasgow', 'Narvik', 'Edinburgh', 'Riga'],
    'C': ['Arkhangelsk', 'Cork', 'Yakutsk', 'Tallinn'],
    'D': ['Winnipeg', 'Ottawa', 'Norilsk', 'Aarhus']
  },
  'Запад': {
    'A': ['Chicago', 'Turin', 'Cadiz', 'Kingston'],
    'B': ['Cologne', 'Verdun', 'Dakar', 'Tunis'],
    'C': ['Kursk', 'Minsk', 'Essen', 'Mexico'],
    'D': ['Austin', 'Reno', 'Toronto', 'Tucson']
  },
  'Юг': {
    'A': ['Krasnodar', 'Cairo', 'Damascus', 'Aden'],
    'B': ['Plymouth', 'Makhachkala', 'Lahore', 'Muscat'],
    'C': ['Baku', 'Sevastopol', 'Tampa', 'Hanoi'],
    'D': ['Melbourne', 'Belem', 'Lima', 'Palermo']
  },
  'Восток': {
    'A': ['Tokyo', 'Seoul', 'Shanghai', 'Manila'],
    'B': ['Beijing', 'Cebu', 'Canberra', 'Magadan'],
    'C': ['Singapore', 'Hong Kong', 'Dili', 'Osaka'],
    'D': ['Vladivostok', 'Brisbane', 'Khabarovsk', 'Tagum']
  }
};

const generateTeamPlayers = (teamName: string): Player[] => {
  const firstNames = ['Alexander', 'Marcus', 'Ivan', 'Carlos', 'Ahmed', 'Yuki', 'Lars', 'Diego', 'Viktor', 'Hassan'];
  const lastNames = ['Johnson', 'Silva', 'Petrov', 'Martinez', 'Ali', 'Tanaka', 'Hansen', 'Garcia', 'Volkov', 'Ibrahim'];
  
  return Array.from({ length: 6 }, (_, i) => ({
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    team: teamName,
    age: 20 + Math.floor(Math.random() * 15),
    goals: Math.floor(Math.random() * 25),
    assists: Math.floor(Math.random() * 20),
    losses: Math.floor(Math.random() * 30),
    kpi: +(7 + Math.random() * 3).toFixed(1),
    rating: +(7 + Math.random() * 3).toFixed(1)
  }));
};

const generateStandings = (teams: string[], dateOffset: number = 0): TeamStats[] => {
  const seed = dateOffset * 123;
  
  return teams.map((team, index) => {
    const played = 6;
    const won = Math.floor(Math.random() * (played + 1));
    const lost = Math.floor(Math.random() * (played - won + 1));
    const drawn = played - won - lost;
    const goalsFor = 5 + Math.floor(Math.random() * 20);
    const goalsAgainst = 5 + Math.floor(Math.random() * 20);
    
    return {
      team,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      points: won * 3 + drawn
    };
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });
};

const generateLiveMatches = (): Match[] => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  const divisions = [
    { name: 'Север-A', teams: allDivisions['Север']['A'] },
    { name: 'Запад-A', teams: allDivisions['Запад']['A'] },
    { name: 'Юг-A', teams: allDivisions['Юг']['A'] },
    { name: 'Восток-A', teams: allDivisions['Восток']['A'] }
  ];

  const matches: Match[] = [];
  
  divisions.forEach((div) => {
    const matchHour = (currentHour % 6);
    const matchIndex = Math.floor(matchHour / 1);
    const team1 = div.teams[matchIndex % 4];
    const team2 = div.teams[(matchIndex + 1) % 4];
    
    const matchTime = `${String(currentHour).padStart(2, '0')}:00`;
    const isLive = currentMinute < 50;
    
    matches.push({
      id: `${div.name}-current`,
      division: div.name,
      homeTeam: team1,
      awayTeam: team2,
      homeScore: Math.floor(Math.random() * 4),
      awayScore: Math.floor(Math.random() * 4),
      status: isLive ? 'live' : 'finished',
      time: matchTime,
      minute: isLive ? currentMinute : undefined
    });
  });

  return matches;
};

const generateUpcomingMatches = (): Match[] => {
  const currentTime = new Date();
  const nextHour = (currentTime.getHours() + 1) % 24;
  
  const divisions = [
    { name: 'Север-B', teams: allDivisions['Север']['B'] },
    { name: 'Запад-B', teams: allDivisions['Запад']['B'] },
    { name: 'Юг-B', teams: allDivisions['Юг']['B'] },
    { name: 'Восток-B', teams: allDivisions['Восток']['B'] }
  ];

  return divisions.map((div) => ({
    id: `${div.name}-next`,
    division: div.name,
    homeTeam: div.teams[0],
    awayTeam: div.teams[1],
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming' as MatchStatus,
    time: `${String(nextHour).padStart(2, '0')}:00`
  }));
};

const topScorers: Player[] = [
  { name: 'Eriksson', firstName: 'Erik', lastName: 'Eriksson', team: 'Stockholm', age: 28, goals: 47, assists: 12, losses: 8, kpi: 9.2, rating: 9.2 },
  { name: 'Silva', firstName: 'Carlos', lastName: 'Silva', team: 'Turin', age: 26, goals: 42, assists: 15, losses: 10, kpi: 8.9, rating: 8.9 },
  { name: 'Nakamura', firstName: 'Yuki', lastName: 'Nakamura', team: 'Tokyo', age: 25, goals: 39, assists: 11, losses: 12, kpi: 8.7, rating: 8.7 },
  { name: 'O\'Connor', firstName: 'Sean', lastName: 'O\'Connor', team: 'Cork', age: 29, goals: 38, assists: 9, losses: 14, kpi: 8.5, rating: 8.5 },
  { name: 'Martinez', firstName: 'Diego', lastName: 'Martinez', team: 'Cadiz', age: 27, goals: 36, assists: 13, losses: 11, kpi: 8.4, rating: 8.4 }
];

const topAssisters: Player[] = [
  { name: 'Petrov', firstName: 'Ivan', lastName: 'Petrov', team: 'Murmansk', age: 24, goals: 15, assists: 34, losses: 9, kpi: 8.8, rating: 8.8 },
  { name: 'Anderson', firstName: 'Lars', lastName: 'Anderson', team: 'Glasgow', age: 26, goals: 18, assists: 31, losses: 7, kpi: 8.6, rating: 8.6 },
  { name: 'Chen', firstName: 'Wei', lastName: 'Chen', team: 'Shanghai', age: 23, goals: 12, assists: 29, losses: 11, kpi: 8.4, rating: 8.4 },
  { name: 'Ibrahim', firstName: 'Ahmed', lastName: 'Ibrahim', team: 'Cairo', age: 27, goals: 14, assists: 27, losses: 13, kpi: 8.2, rating: 8.2 },
  { name: 'Santos', firstName: 'Miguel', lastName: 'Santos', team: 'Lima', age: 25, goals: 16, assists: 25, losses: 10, kpi: 8.1, rating: 8.1 }
];

const topRated: Player[] = [
  { name: 'Johansson', firstName: 'Marcus', lastName: 'Johansson', team: 'Helsinki', age: 30, goals: 22, assists: 18, losses: 5, kpi: 9.2, rating: 9.2 },
  { name: 'Volkov', firstName: 'Viktor', lastName: 'Volkov', team: 'Krasnodar', age: 28, goals: 25, assists: 20, losses: 6, kpi: 9.1, rating: 9.1 },
  { name: 'Kim', firstName: 'Min-ho', lastName: 'Kim', team: 'Seoul', age: 26, goals: 21, assists: 16, losses: 7, kpi: 8.9, rating: 8.9 },
  { name: 'Murphy', firstName: 'Connor', lastName: 'Murphy', team: 'Edinburgh', age: 29, goals: 19, assists: 17, losses: 8, kpi: 8.8, rating: 8.8 },
  { name: 'Garcia', firstName: 'Carlos', lastName: 'Garcia', team: 'Mexico', age: 27, goals: 23, assists: 14, losses: 9, kpi: 8.7, rating: 8.7 }
];

const MatchCard = ({ match }: { match: Match }) => (
  <Card className="p-4 bg-card border-border hover:border-accent transition-colors">
    <div className="flex items-center justify-between mb-3">
      <Badge variant="outline" className="text-xs font-normal">
        {match.division}
      </Badge>
      {match.status === 'live' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full live-pulse" />
          <span className="text-accent text-sm font-medium">{match.minute}'</span>
        </div>
      )}
      {match.status === 'finished' && (
        <Badge variant="secondary" className="text-xs">ЗАВЕРШЕН</Badge>
      )}
      {match.status === 'upcoming' && (
        <span className="text-muted-foreground text-sm">{match.time}</span>
      )}
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium">{match.homeTeam}</span>
        {match.status !== 'upcoming' && (
          <span className="text-2xl font-bold text-foreground">{match.homeScore}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium">{match.awayTeam}</span>
        {match.status !== 'upcoming' && (
          <span className="text-2xl font-bold text-foreground">{match.awayScore}</span>
        )}
      </div>
    </div>
  </Card>
);

const LeaderboardTable = ({ players, type }: { players: Player[], type: 'goals' | 'assists' | 'rating' }) => (
  <div className="space-y-2">
    {players.map((player, index) => (
      <div 
        key={index}
        className="flex items-center justify-between p-4 bg-card border border-border rounded hover:border-accent transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-accent w-8">{index + 1}</span>
          <div>
            <p className="font-semibold text-foreground">{player.name}</p>
            <p className="text-sm text-muted-foreground">{player.team}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {type === 'goals' && player.goals}
          {type === 'assists' && player.assists}
          {type === 'rating' && player.rating}
        </span>
      </div>
    ))}
  </div>
);

const StandingsTable = ({ standings, onTeamClick }: { standings: TeamStats[], onTeamClick: (team: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left p-3 text-sm font-semibold text-muted-foreground">#</th>
          <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Команда</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">И</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">В</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Н</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">П</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">ЗГ</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">ПГ</th>
          <th className="text-center p-3 text-sm font-semibold text-muted-foreground">РГ</th>
          <th className="text-center p-3 text-sm font-semibold text-accent">О</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team, index) => (
          <tr 
            key={team.team}
            className="border-b border-border hover:bg-card/50 cursor-pointer transition-colors"
            onClick={() => onTeamClick(team.team)}
          >
            <td className="p-3 text-center font-bold text-accent">{index + 1}</td>
            <td className="p-3 font-semibold text-foreground">{team.team}</td>
            <td className="p-3 text-center text-muted-foreground">{team.played}</td>
            <td className="p-3 text-center text-foreground">{team.won}</td>
            <td className="p-3 text-center text-muted-foreground">{team.drawn}</td>
            <td className="p-3 text-center text-muted-foreground">{team.lost}</td>
            <td className="p-3 text-center text-foreground">{team.goalsFor}</td>
            <td className="p-3 text-center text-muted-foreground">{team.goalsAgainst}</td>
            <td className={`p-3 text-center font-semibold ${team.goalDiff > 0 ? 'text-green-500' : team.goalDiff < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
            </td>
            <td className="p-3 text-center font-bold text-accent text-lg">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [liveMatches] = useState(generateLiveMatches());
  const [upcomingMatches] = useState(generateUpcomingMatches());
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [statsDate, setStatsDate] = useState(0);

  const handleTeamClick = (team: string) => {
    setSelectedTeam(team);
    setTeamPlayers(generateTeamPlayers(team));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded flex items-center justify-center">
                <Icon name="Trophy" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">IPFL</h1>
                <p className="text-xs text-muted-foreground">International Professional Football League</p>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'live', label: 'Live', icon: 'Radio' },
              { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
              { id: 'divisions', label: 'Дивизоны', icon: 'Grid3x3' },
              { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
              { id: 'news', label: 'Новости', icon: 'Newspaper' }
            ].map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                className={activeSection === section.id ? 'bg-accent hover:bg-accent/90' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon name={section.icon as any} size={18} className="mr-2" />
                {section.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Лидеры сезона</h2>
              <Tabs defaultValue="goals" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
                  <TabsTrigger value="goals" className="data-[state=active]:bg-accent">
                    <Icon name="Target" size={18} className="mr-2" />
                    Голы
                  </TabsTrigger>
                  <TabsTrigger value="assists" className="data-[state=active]:bg-accent">
                    <Icon name="Zap" size={18} className="mr-2" />
                    Ассисты
                  </TabsTrigger>
                  <TabsTrigger value="rating" className="data-[state=active]:bg-accent">
                    <Icon name="Star" size={18} className="mr-2" />
                    Рейтинг
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="goals" className="mt-6">
                  <LeaderboardTable players={topScorers} type="goals" />
                </TabsContent>
                <TabsContent value="assists" className="mt-6">
                  <LeaderboardTable players={topAssisters} type="assists" />
                </TabsContent>
                <TabsContent value="rating" className="mt-6">
                  <LeaderboardTable players={topRated} type="rating" />
                </TabsContent>
              </Tabs>
            </section>
          </div>
        )}

        {activeSection === 'live' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                <div className="w-3 h-3 bg-accent rounded-full live-pulse" />
                Идут сейчас
              </h2>
              <div className="grid gap-4">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Следующие матчи</h2>
              <div className="grid gap-4">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'schedule' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Расписание</h2>
            <div className="text-center py-12">
              <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}

        {activeSection === 'divisions' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Дивизоны</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(allDivisions).map(([divisionName, groups]) => (
                <Card key={divisionName} className="p-6 bg-card border-border">
                  <h3 className="text-2xl font-bold mb-4 text-accent">{divisionName}</h3>
                  <div className="space-y-6">
                    {Object.entries(groups).map(([groupLetter, teams]) => (
                      <div key={groupLetter}>
                        <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-sm">Группа {groupLetter}</Badge>
                        </h4>
                        <ul className="space-y-2">
                          {teams.map((team) => (
                            <li key={team} className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                              <Icon name="Circle" size={8} className="text-accent" />
                              {team}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'stats' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">Статистика</h2>
              <div className="flex gap-2">
                <Button
                  variant={statsDate === -1 ? 'default' : 'outline'}
                  onClick={() => setStatsDate(-1)}
                  className={statsDate === -1 ? 'bg-accent' : ''}
                >
                  Вчера
                </Button>
                <Button
                  variant={statsDate === 0 ? 'default' : 'outline'}
                  onClick={() => setStatsDate(0)}
                  className={statsDate === 0 ? 'bg-accent' : ''}
                >
                  Сегодня
                </Button>
                <Button
                  variant={statsDate === 1 ? 'default' : 'outline'}
                  onClick={() => setStatsDate(1)}
                  className={statsDate === 1 ? 'bg-accent' : ''}
                >
                  Завтра
                </Button>
              </div>
            </div>

            <Tabs defaultValue="north" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card border border-border mb-6">
                <TabsTrigger value="north" className="data-[state=active]:bg-accent">Север</TabsTrigger>
                <TabsTrigger value="west" className="data-[state=active]:bg-accent">Запад</TabsTrigger>
                <TabsTrigger value="south" className="data-[state=active]:bg-accent">Юг</TabsTrigger>
                <TabsTrigger value="east" className="data-[state=active]:bg-accent">Восток</TabsTrigger>
              </TabsList>

              {(['north', 'west', 'south', 'east'] as const).map((region, regionIndex) => {
                const divisionName = ['Север', 'Запад', 'Юг', 'Восток'][regionIndex];
                const groups = allDivisions[divisionName as keyof typeof allDivisions];

                return (
                  <TabsContent key={region} value={region} className="space-y-8">
                    {Object.entries(groups).map(([groupLetter, teams]) => (
                      <Card key={groupLetter} className="p-6 bg-card border-border">
                        <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                          {divisionName} - Группа {groupLetter}
                        </h3>
                        <StandingsTable 
                          standings={generateStandings(teams, statsDate)} 
                          onTeamClick={handleTeamClick}
                        />
                      </Card>
                    ))}
                  </TabsContent>
                );
              })}
            </Tabs>
          </section>
        )}

        {activeSection === 'news' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Новости</h2>
            <div className="text-center py-12">
              <Icon name="Newspaper" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}
      </main>

      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-4xl bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">{selectedTeam}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-4 text-foreground">Состав команды</h4>
            <div className="space-y-3">
              {teamPlayers.map((player, index) => (
                <Card key={index} className="p-4 bg-background border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-foreground text-lg">{player.firstName} {player.lastName}</h5>
                      <p className="text-sm text-muted-foreground mb-3">Возраст: {player.age} лет</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Голы</p>
                      <p className="text-lg font-bold text-accent">{player.goals}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Ассисты</p>
                      <p className="text-lg font-bold text-foreground">{player.assists}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Потери</p>
                      <p className="text-lg font-bold text-foreground">{player.losses}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">КПД</p>
                      <p className="text-lg font-bold text-foreground">{player.kpi}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Рейтинг</p>
                      <p className="text-lg font-bold text-accent">{player.rating}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2026 International Professional Football League. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
