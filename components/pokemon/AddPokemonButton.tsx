"use client";

import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { searchPokemonByName, getPokemonImageUrl } from "@/lib/utils/pokeapi";
import { createPokemonAction } from "@/lib/actions/pokemonActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function AddPokemonButton() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundPokemon, setFoundPokemon] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a Pokemon name");
      return;
    }

    setIsSearching(true);
    setFoundPokemon(null);

    try {
      const pokemon = await searchPokemonByName(searchQuery.trim());
      if (pokemon) {
        setFoundPokemon(pokemon);
      } else {
        toast.error("Pokemon not found. Please check the name and try again.");
      }
    } catch (error) {
      toast.error("Error searching for Pokemon");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPokemon = async () => {
    if (!foundPokemon) return;

    setIsAdding(true);
    try {
      const imageUrl = getPokemonImageUrl(foundPokemon);
      const formData = new FormData();
      formData.append("pokemon_id", foundPokemon.id.toString());
      formData.append("pokemon_name", foundPokemon.name);
      formData.append("pokemon_image_url", imageUrl);

      const result = await createPokemonAction(formData);

      if (result.success) {
        toast.success("Pokemon added successfully!");
        setIsFormVisible(false);
        setSearchQuery("");
        setFoundPokemon(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add Pokemon");
      }
    } catch (error) {
      toast.error("Error adding Pokemon");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog
      open={isFormVisible}
      onOpenChange={(open) => {
        setIsFormVisible(open);
        if (!open) {
          setSearchQuery("");
          setFoundPokemon(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={"icon-lg"}
          variant={"outline"}
          className="cursor-pointer absolute bottom-4 right-4 rounded-full"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Pokemon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search Pokemon by name (e.g., pikachu)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {foundPokemon && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={getPokemonImageUrl(foundPokemon)}
                    alt={foundPokemon.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold capitalize">
                    {foundPokemon.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {foundPokemon.id}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAddPokemon}
                disabled={isAdding}
                className="w-full"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Pokemon"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

