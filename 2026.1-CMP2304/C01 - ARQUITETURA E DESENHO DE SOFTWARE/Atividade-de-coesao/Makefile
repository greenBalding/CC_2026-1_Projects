CC=clang
CFLAGS=-g -Wall -Wextra
SRC=coesao.c
BIN=coesao

.PHONY: all build run test clean

all: build

build:
	$(CC) $(CFLAGS) $(SRC) -o $(BIN)

run: build
	./$(BIN)

test: build
	printf "1\n1990\n2026\n0\n" | ./$(BIN)

clean:
	rm -f $(BIN)
