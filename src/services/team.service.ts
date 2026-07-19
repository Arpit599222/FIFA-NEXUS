import { supabase } from './supabase';
import { teams as mockTeams } from '../mock-data';

const isPlaceholder = import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_URL === '';

export interface Team {
  team_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  fifa_mix_theme: string;
}

export const teamService = {
  async getTeams() {
    if (isPlaceholder) {
      const formattedTeams: Team[] = mockTeams.map(t => ({
        team_name: t.name,
        primary_color: t.color,
        secondary_color: '#FFFFFF',
        accent_color: '#E2E8F0',
        fifa_mix_theme: t.theme
      }));
      return { data: formattedTeams, error: null };
    }

    const { data, error } = await supabase
      .from('teams')
      .select('*');

    return { data: data as Team[], error };
  },

  async getTeam(teamName: string) {
    if (isPlaceholder) {
      const match = mockTeams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
      if (match) {
        const teamData: Team = {
          team_name: match.name,
          primary_color: match.color,
          secondary_color: '#FFFFFF',
          accent_color: '#E2E8F0',
          fifa_mix_theme: match.theme
        };
        return { data: teamData, error: null };
      }
      return { data: null, error: new Error('Team not found') };
    }

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('team_name', teamName)
      .single();

    return { data: data as Team, error };
  }
};
